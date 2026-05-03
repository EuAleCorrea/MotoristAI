import React from 'react';

type FormTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
};

const FormTextArea: React.FC<FormTextAreaProps> = ({ label, id, ...props }) => (
    <div className="md:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ios-text)' }}>{label}</label>
        <textarea
            id={id}
            rows={3}
            {...props}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition"
            style={{
                backgroundColor: 'var(--ios-card)',
                borderColor: 'var(--ios-separator)',
                color: 'var(--ios-text)',
            }}
        />
    </div>
);

export default FormTextArea;
