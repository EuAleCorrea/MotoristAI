const KEYWORD_CATEGORIES: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['uber', '99app', '99 app', 'cabify', 'inDriver', 'indriver', 'lyft', 'bolt'], category: 'Transporte (Motorista)' },
  { keywords: ['posto', 'shell', 'petrobras', 'ipiranga', 'ale', 'br mania', 'gasolina', 'etanol', 'diesel', 'combustivel', 'combustível'], category: 'Combustível' },
  { keywords: ['eletropaulo', 'enel', 'cemig', 'cpfl', 'light', 'equatorial', 'energisa', 'celesc', 'coelba', 'rge', 'conta de luz', 'energia eletrica', 'energia elétrica'], category: 'Energia' },
  { keywords: ['pedagio', 'pedágio', 'ccr', 'ecoNoroeste', 'econoroeste', 'arteris', 'via'], category: 'Pedágio' },
  { keywords: ['estapar', 'multiPark', 'multipark', 'estacionamento', 'parking', 'zona azul', 'cartao azul'], category: 'Estacionamento' },
  { keywords: ['oficina', 'mecanico', 'mecânico', 'autopeças', 'autopecas', 'troca de oleo', 'troca de óleo', 'pneu', 'alinhamento', 'balanceamento', 'revisao', 'revisão'], category: 'Manutenção Veículo' },
  { keywords: ['ipva', 'dpvat', 'licenciamento', 'seguro auto', 'seguro do carro'], category: 'Impostos Veículo' },
  { keywords: ['financiamento', 'parcela carro', 'parcela do carro', 'consorcio', 'consórcio'], category: 'Financiamento Veículo' },
  { keywords: ['ifood', 'iFood', 'uber eats', 'rappi', 'james delivery', 'aiqfome', 'goomer'], category: 'Alimentação (Delivery)' },
  { keywords: ['restaurante', 'lanchonete', 'padaria', 'pizzaria', 'hamburgueria', 'bar ', 'churrascaria', 'mcdonald', 'burger king', 'subway', 'starbucks'], category: 'Alimentação (Restaurante)' },
  { keywords: ['mercado', 'supermercado', 'atacadao', 'atacadão', 'assaí', 'assai', 'carrefour', 'extra ', 'pao de acucar', 'pão de açúcar', 'dia ', 'tenda atacado', 'makro'], category: 'Supermercado' },
  { keywords: ['farmacia', 'farmácia', 'drogaria', 'drogasil', 'raia', 'pague menos', 'pacheco', 'panvel', 'ultrafarma'], category: 'Saúde' },
  { keywords: ['hospital', 'clinica', 'clínica', 'unimed', 'amil', 'hapvida', 'notredame', 'sulamerica', 'bradesco saude', 'bradesco saúde', 'porto seguro saude', 'porto seguro saúde', 'consulta medica', 'exame'], category: 'Saúde' },
  { keywords: ['aluguel', 'condominio', 'condomínio', 'iptu', 'conta de agua', 'conta de água', 'sabesp', 'cedae', 'sanepar', 'casas bahia', 'eletro'], category: 'Moradia' },
  { keywords: ['netflix', 'spotify', 'amazon prime', 'disney', 'hbo', 'globoplay', 'paramount', 'apple tv', 'youtube premium', 'deezer', 'tidal', 'claro tv', 'vivo tv'], category: 'Assinaturas' },
  { keywords: ['vivo', 'claro', 'tim ', 'oi ', 'nextel', 'algar', 'sercomtel', 'conta de telefone', 'conta de celular', 'internet'], category: 'Telefonia/Internet' },
  { keywords: ['academia', 'smart fit', 'bluefit', 'gympass', 'wellhub', 'total pass', 'crossfit'], category: 'Saúde/Fitness' },
  { keywords: ['escola', 'colegio', 'colégio', 'faculdade', 'universidade', 'curso', 'mensalidade', 'udemy', 'coursera', 'alura', 'rocketseat'], category: 'Educação' },
  { keywords: ['cinema', 'teatro', 'show', 'ingresso', 'parque', 'bar ', 'balada', 'boate', 'festa'], category: 'Lazer' },
  { keywords: ['pix recebido', 'transferencia recebida', 'transferência recebida', 'deposito', 'depósito', 'ted recebida', 'doc recebido'], category: 'Receitas (PIX/Transf)' },
];

const DEFAULT_EXPENSE_CATEGORY = 'Outros';
const DEFAULT_INCOME_CATEGORY = 'Receitas (Outros)';

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function suggestCategory(description: string, type: 'credit' | 'debit'): string {
  if (!description) return type === 'credit' ? DEFAULT_INCOME_CATEGORY : DEFAULT_EXPENSE_CATEGORY;
  const norm = normalize(description);
  for (const entry of KEYWORD_CATEGORIES) {
    for (const kw of entry.keywords) {
      const kwNorm = normalize(kw);
      if (norm.includes(kwNorm)) return entry.category;
    }
  }
  return type === 'credit' ? DEFAULT_INCOME_CATEGORY : DEFAULT_EXPENSE_CATEGORY;
}

export const DEFAULT_CATEGORIES = Array.from(
  new Set([
    DEFAULT_EXPENSE_CATEGORY,
    DEFAULT_INCOME_CATEGORY,
    ...KEYWORD_CATEGORIES.map((k) => k.category),
  ])
);
