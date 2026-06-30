import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import { formatNumber, parseAmount } from '../../utils/formatters';

type MoneyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
 label: string;
 id: string;
 icon?: React.ReactNode;
 onChange?: (e: any) => void;
};

/**
 * Componente de entrada de valores monetários que formata para pt-BR no blur.
 * Notifica o parent com o valor numérico a CADA keystroke (não só no blur),
 * evitando perda de dados quando o usuário clica "Salvar" sem tirar o foco.
 */
const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChange, onFocus, onBlur, ...props }) => {
 const [displayValue, setDisplayValue] = useState<string>('');

 // Sincroniza o valor inicial e mudanças externas
 useEffect(() => {
 if (value !== undefined && value !== null && value !== '') {
 const numericValue = typeof value === 'number' ? value : parseAmount(value.toString());
 setDisplayValue(numericValue !== null ? formatNumber(numericValue) : '');
 } else {
 setDisplayValue('');
 }
 }, [value]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const raw = e.target.value;
 setDisplayValue(raw);
 // Notifica o parent IMEDIATAMENTE com o valor numérico parseado,
 // para que o handleSubmit sempre tenha o valor correto, mesmo sem blur.
 if (onChange) {
 const parsed = parseAmount(raw);
 onChange({
 target: {
 name: props.name || props.id,
 value: parsed !== null ? parsed.toString() : ''
 }
 });
 }
 };

 const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
 // Quando focar, removemos os pontos de milhar para facilitar a edição
 // Mas mantemos a vírgula decimal se houver
 const numericValue = parseAmount(displayValue);
 if (numericValue !== null && numericValue !== 0) {
 setDisplayValue(numericValue.toString().replace('.', ','));
 }
 if (onFocus) onFocus(e);
 };

 const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
 const numericValue = parseAmount(displayValue);

 // Formata para o padrão brasileiro bonito: 1.234,56
 const formatted = numericValue !== null ? formatNumber(numericValue) : '';
 setDisplayValue(formatted);

 // Re-notifica o parent com o valor formatado (sanitizado)
 if (onChange) {
 onChange({
 target: {
 name: props.name || props.id,
 value: numericValue !== null ? numericValue.toString() : ''
 }
 });
 }
 if (onBlur) onBlur(e);
 };

 return (
 <FormInput
 {...props}
 type="text" // text para permitir vírgula como decimal (pt-BR)
 inputMode="decimal"
 lang="pt-BR"
 value={displayValue}
 onFocus={handleFocus}
 onBlur={handleBlur}
 onChange={handleChange}
 />
 );
};

export default MoneyInput;
