/**
 * exportCsv — Utilitário para exportar dados como CSV
 * 
 * Gera um arquivo CSV no formato UTF-8 com BOM (para acentos funcionarem no Excel)
 * e faz o download automático no navegador.
 */

/**
 * Converte um array de objetos para CSV e dispara o download.
 *
 * @param data       - Array de objetos a serem exportados
 * @param columns    - Mapeamento { headerKey: "Nome da Coluna" } na ordem desejada
 * @param filename   - Nome do arquivo (sem extensão)
 * @param formatters - Funções opcionais para formatar valores { headerKey: (value) => string }
 */
export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  columns: Record<string, string>,
  filename: string,
  formatters?: Partial<Record<keyof T, (value: any) => string>>,
) {
  if (data.length === 0) {
    alert('Nenhum dado para exportar.');
    return;
  }

  const keys = Object.keys(columns);
  const headers = keys.map((k) => columns[k]);

  // Linhas
  const rows = data.map((item) =>
    keys.map((key) => {
      const value = item[key];
      // Aplica formatador se existir
      const formatted = formatters?.[key] ? formatters[key]!(value) : value;
      // Escapa aspas duplas e encapsula em aspas se necessário
      const str = String(formatted ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(','),
  );

  // Monta CSV com BOM (UTF-8 BOM: \uFEFF)
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formata uma data ISO para DD/MM/AAAA
 */
export function formatDateBR(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata valor numérico como moeda brasileira (R$ 1.234,56)
 */
export function formatCurrencyBR(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
