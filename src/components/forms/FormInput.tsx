import React from 'react';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: React.ReactNode;
};

const FormInput: React.FC<FormInputProps> = ({ label, id, icon, ...props }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ios-text)' }}>{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--ios-text-secondary)' }}>{icon}</div>}
            <input
                id={id}
                {...props}
                className={`w-full py-2 border rounded-lg focus:ring-2 transition disabled:opacity-60 ${icon ? 'pl-10 pr-3' : 'px-3'}`}
                style={{
                    backgroundColor: 'var(--ios-card)',
                    borderColor: 'var(--ios-separator)',
                    color: 'var(--ios-text)',
                }}
            />
        </div>
    </div>
);

export default FormInput;
