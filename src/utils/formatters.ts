/**
 * Utilitários de formatação para o padrão brasileiro (pt-BR)
 * SEMPRE use estas funções para exibir valores ao usuário
 */

/**
 * Formata um valor numérico como moeda brasileira (R$)
 * @param value - Valor numérico a ser formatado
 * @param includeSymbol - Se deve incluir o símbolo 'R$' (padrão: true)
 * @returns String formatada no padrão "R$ 1.234,56"
 */
export function formatCurrency(value: number | undefined | null, includeSymbol: boolean = true): string {
    if (value === undefined || value === null || isNaN(value)) {
        return includeSymbol ? 'R$ 0,00' : '0,00';
    }
    const formatted = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return includeSymbol ? formatted : formatted.replace('R$', '').trim();
}

/**
 * Formata um valor numérico com separadores brasileiros
 * @param value - Valor numérico a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada no padrão "1.234,56"
 */
export function formatNumber(value: number | undefined | null, decimals: number = 2): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Formata um valor como percentual no padrão brasileiro
 * @param value - Valor numérico (ex: 85.5 para 85,5%)
 * @param decimals - Número de casas decimais (padrão: 0)
 * @returns String formatada no padrão "85,5%"
 */
export function formatPercent(value: number | undefined | null, decimals: number = 0): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0%';
    }
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }) + '%';
}

/**
 * Formata um valor inteiro com separadores de milhar brasileiros
 * @param value - Valor numérico
 * @returns String formatada no padrão "1.234"
 */
export function formatInteger(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    return Math.round(value).toLocaleString('pt-BR');
}

/**
 * Formata valores para tooltips de gráficos ECharts
 * @param value - Valor numérico
 * @returns String formatada como moeda para tooltip
 */
export function formatChartCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
/**
 * Converte uma string formatada em Real (R$ 1.234,56 ou 1.234,56) para um número
 * @param value - String formatada
 * @returns Valor numérico
 */
export function parseCurrency(value: string | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;

    // Remove o símbolo R$, limpa espaços, remove pontos (milhar) e troca vírgula por ponto (decimal)
    const cleanValue = value
        .toString()
        .replace('R$', '')
        .trim()
        .replace(/\./g, '')
        .replace(',', '.');

    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
}
