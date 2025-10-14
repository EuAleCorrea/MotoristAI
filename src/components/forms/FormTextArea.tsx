import React from 'react';

type FormTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

const FormTextArea: React.FC<FormTextAreaProps> = ({ label, id, ...props }) => (
  <div className="md:col-span-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <textarea
      id={id}
      rows={3}
      {...props}
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
    />
  </div>
);

export default FormTextArea;
