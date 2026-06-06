export type RawTransactionType = 'credit' | 'debit';

export interface RawTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: RawTransactionType;
  raw: string;
}

export type ParseErrorCode =
  | 'EMPTY_FILE'
  | 'UNRECOGNIZED_FORMAT'
  | 'NO_TRANSACTIONS'
  | 'INVALID_HEADER';

export class ParseError extends Error {
  code: ParseErrorCode;
  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'ParseError';
  }
}

export interface ParseResult {
  source: 'csv' | 'ofx';
  transactions: RawTransaction[];
  skipped: number;
}

const DATE_PATTERNS: Array<{ regex: RegExp; toISO: (m: RegExpMatchArray) => string }> = [
  { regex: /^(\d{4})-(\d{2})-(\d{2})$/, toISO: (m) => `${m[1]}-${m[2]}-${m[3]}` },
  { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, toISO: (m) => `${m[1]}-${m[2]}-${m[3]}` },
  { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, toISO: (m) => `${m[3]}-${m[2]}-${m[1]}` },
  { regex: /^(\d{2})-(\d{2})-(\d{4})$/, toISO: (m) => `${m[3]}-${m[2]}-${m[1]}` },
  { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, toISO: (m) => `${m[3]}-${m[2]}-${m[1]}` },
  { regex: /^(\d{8})$/, toISO: (m) => `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}` },
];

export function normalizeDate(input: string): string | null {
  const trimmed = input.trim();
  for (const p of DATE_PATTERNS) {
    const m = trimmed.match(p.regex);
    if (m) {
      const iso = p.toISO(m);
      const d = new Date(`${iso}T12:00:00`);
      if (!isNaN(d.getTime())) return iso;
    }
  }
  return null;
}

export function normalizeAmount(input: string): number | null {
  if (input === null || input === undefined) return null;
  let s = String(input).trim();
  if (!s) return null;

  const isNegative = s.startsWith('-') || s.startsWith('(') || /D\b/i.test(s) || /DEBIT/i.test(s);
  s = s.replace(/[()]/g, '').replace(/^-/, '').replace(/R\$/gi, '').replace(/[A-Z]{3,}/gi, '').trim();
  if (!s) return null;

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  let normalized: string;
  if (hasComma && hasDot) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      normalized = s.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    const parts = s.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = parts[0].replace(/\./g, '') + '.' + parts[1];
    } else {
      normalized = s.replace(/\./g, '').replace(/,/g, '.');
    }
  } else {
    normalized = s.replace(/,/g, '');
  }

  const n = parseFloat(normalized);
  if (isNaN(n)) return null;
  return isNegative ? -Math.abs(n) : n;
}

export function detectFormat(content: string): 'csv' | 'ofx' {
  const head = content.slice(0, 512).trim();
  if (/^<\?xml|<OFX[\s>]/i.test(head)) return 'ofx';
  return 'csv';
}

const CSV_DELIMITERS = [',', ';', '\t', '|'] as const;

function detectDelimiter(sample: string): string {
  const firstLine = sample.split(/\r?\n/, 1)[0] || '';
  let best = ',';
  let bestCount = -1;
  for (const d of CSV_DELIMITERS) {
    const count = (firstLine.match(new RegExp(`\\${d}`, 'g')) || []).length;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

const HEADER_KEYWORDS = {
  date: ['data', 'date', 'dt', 'dtposted', 'data lancamento', 'data lançamento', 'data_transacao', 'data transacao'],
  description: ['descricao', 'descrição', 'description', 'historico', 'histórico', 'memo', 'name', 'lancamento', 'lançamento', 'detalhe'],
  amount: ['valor', 'amount', 'value', 'trnamt', 'vlr', 'quantia'],
  type: ['tipo', 'type', 'trntype', 'operacao', 'operação'],
};

function findColumnIndex(headers: string[], kind: keyof typeof HEADER_KEYWORDS): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().trim();
    if (HEADER_KEYWORDS[kind].some((k) => h === k || h.includes(k))) return i;
  }
  return -1;
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseCsv(content: string): ParseResult {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) throw new ParseError('EMPTY_FILE', 'Arquivo vazio');

  const delimiter = detectDelimiter(lines[0]);
  const firstRow = parseCsvLine(lines[0], delimiter);
  const lowerFirst = firstRow.map((c) => c.toLowerCase());
  const hasHeader = lowerFirst.some((c) =>
    Object.values(HEADER_KEYWORDS).some((keywords) => keywords.some((k) => c === k || c.includes(k)))
  );

  let dateIdx: number;
  let descIdx: number;
  let amountIdx: number;
  let typeIdx: number;
  let dataStart: number;

  if (hasHeader) {
    dateIdx = findColumnIndex(firstRow, 'date');
    descIdx = findColumnIndex(firstRow, 'description');
    amountIdx = findColumnIndex(firstRow, 'amount');
    typeIdx = findColumnIndex(firstRow, 'type');
    if (dateIdx === -1 || amountIdx === -1) {
      throw new ParseError('INVALID_HEADER', 'Cabeçalho não contém colunas de data e valor');
    }
    dataStart = 1;
  } else {
    dateIdx = 0;
    descIdx = 1;
    amountIdx = 2;
    typeIdx = -1;
    dataStart = 0;
  }

  const transactions: RawTransaction[] = [];
  let skipped = 0;

  for (let i = dataStart; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], delimiter);
    if (cols.length < 2) {
      skipped++;
      continue;
    }
    const date = normalizeDate(cols[dateIdx] || '');
    const description = (cols[descIdx] || '').trim();
    const amountRaw = (cols[amountIdx] || '').trim();
    const amount = normalizeAmount(amountRaw);
    if (!date || amount === null || !description) {
      skipped++;
      continue;
    }
    let type: RawTransactionType;
    if (typeIdx >= 0 && cols[typeIdx]) {
      const t = cols[typeIdx].toUpperCase();
      type = t.includes('C') || t.includes('+') || /credit/i.test(t) ? 'credit' : 'debit';
    } else {
      type = amount >= 0 ? 'credit' : 'debit';
    }
    transactions.push({
      id: makeId(),
      date,
      description,
      amount: Math.abs(amount),
      type,
      raw: lines[i],
    });
  }

  if (transactions.length === 0) {
    throw new ParseError('NO_TRANSACTIONS', 'Nenhuma transação válida encontrada');
  }

  return { source: 'csv', transactions, skipped };
}

function parseOfx(content: string): ParseResult {
  const blocks = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) || [];
  if (blocks.length === 0) {
    throw new ParseError('NO_TRANSACTIONS', 'Nenhum STMTTRN encontrado no OFX');
  }

  const transactions: RawTransaction[] = [];
  let skipped = 0;

  for (const block of blocks) {
    const get = (tag: string): string => {
      const m = block.match(new RegExp(`<${tag}>([^<\\r\\n]+)`, 'i'));
      return m ? m[1].trim() : '';
    };
    const dt = get('DTPOSTED') || get('DTUSER');
    const trntype = get('TRNTYPE');
    const trnamt = get('TRNAMT');
    const name = get('NAME') || get('PAYEE');
    const memo = get('MEMO');
    const fitid = get('FITID');

    const date = normalizeDate(dt.replace(/\[.*?\]$/, ''));
    const amount = normalizeAmount(trnamt);
    if (!date || amount === null) {
      skipped++;
      continue;
    }
    const description = [name, memo].filter(Boolean).join(' — ').trim() || fitid || 'Transação';
    const isCredit = (trntype && /CREDIT|DEP|XFER IN/i.test(trntype)) || amount >= 0;
    transactions.push({
      id: makeId(),
      date,
      description,
      amount: Math.abs(amount),
      type: isCredit ? 'credit' : 'debit',
      raw: block.replace(/\s+/g, ' ').trim(),
    });
  }

  if (transactions.length === 0) {
    throw new ParseError('NO_TRANSACTIONS', 'Nenhuma transação válida no OFX');
  }

  return { source: 'ofx', transactions, skipped };
}

export function parseBankStatement(content: string): ParseResult {
  if (!content || !content.trim()) {
    throw new ParseError('EMPTY_FILE', 'Arquivo vazio');
  }
  const format = detectFormat(content);
  if (format === 'ofx') return parseOfx(content);
  return parseCsv(content);
}

export async function readFileAsText(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new ParseError('UNRECOGNIZED_FORMAT', 'Arquivo muito grande (máx 10 MB)');
  }
  return await file.text();
}
