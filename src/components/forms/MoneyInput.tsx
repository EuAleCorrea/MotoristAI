import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import { formatNumber, parseCurrency } from '../../utils/formatters';

type MoneyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    label: string;
    id: string;
    icon?: React.ReactNode;
    onChange?: (e: any) => void;
};

/**
 * Componente de entrada de valores monetários que formata para pt-BR no blur.
 */
const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChange, onFocus, onBlur, ...props }) => {
    const [displayValue, setDisplayValue] = useState<string>('');

    // Sincroniza o valor inicial e mudanças externas
    useEffect(() => {
        if (value !== undefined && value !== null && value !== '') {
            const numericValue = typeof value === 'number' ? value : parseCurrency(value.toString());
            setDisplayValue(formatNumber(numericValue));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Quando focar, removemos os pontos de milhar para facilitar a edição
        // Mas mantemos a vírgula decimal se houver
        const numericValue = parseCurrency(displayValue);
        if (numericValue !== 0) {
            // Formata apenas com a vírgula, sem pontos
            setDisplayValue(numericValue.toString().replace('.', ','));
        }
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const numericValue = parseCurrency(displayValue);

        // Formata para o padrão brasileiro bonito: 1.234,56
        const formatted = formatNumber(numericValue);
        setDisplayValue(formatted);

        // Notifica o pai com o valor numérico (como string para manter compatibilidade com FormInput)
        if (onChange) {
            onChange({
                target: {
                    name: props.name || props.id,
                    value: numericValue.toString()
                }
            });
        }
        if (onBlur) onBlur(e);
    };

    return (
        <FormInput
            {...props}
            type="text" // Mudamos para text para permitir caracteres de formatação
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setDisplayValue(e.target.value)}
        />
    );
};

export default MoneyInput;
