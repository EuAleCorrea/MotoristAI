import React from 'react';
import { AppSelect, AppSelectOption } from './AppSelect';

type FormSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
};

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  id,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ios-text)' }}>
      {label}
    </label>
    <AppSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

export default FormSelect;
