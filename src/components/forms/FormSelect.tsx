import React from 'react';

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    children: React.ReactNode;
};

const FormSelect: React.FC<FormSelectProps> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ios-text)' }}>{label}</label>
        <select
            id={id}
            {...props}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition"
            style={{
                backgroundColor: 'var(--ios-card)',
                borderColor: 'var(--ios-separator)',
                color: 'var(--ios-text)',
            }}
        >
            {children}
        </select>
    </div>
);

export default FormSelect;
