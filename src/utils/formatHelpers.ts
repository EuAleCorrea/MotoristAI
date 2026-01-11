/**
 * Formata um número como moeda brasileira (Real)
 * @param value O valor numérico a ser formatado
 * @param includeSymbol Se deve incluir o símbolo 'R$' (padrão: true)
 * @returns String formatada (ex: R$ 1.234,56)
 */
export const formatCurrency = (value: number, includeSymbol: boolean = true): string => {
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

    return includeSymbol ? formatted : formatted.replace('R$', '').trim();
};

/**
 * Formata um número com separadores de milhar e decimal pt-BR
 * @param value O valor numérico a ser formatado
 * @param decimalPlaces Quantidade de casas decimais (padrão: 2)
 * @returns String formatada (ex: 1.234,56)
 */
export const formatNumber = (value: number, decimalPlaces: number = 2): string => {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(value);
};
