import React from 'react';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
};

const FormInput: React.FC<FormInputProps> = ({ label, id, icon, ...props }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-300">{icon}</div>}
      <input
        id={id}
        {...props}
        className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 ${icon ? 'pl-10 pr-3' : 'px-3'}`}
      />
    </div>
  </div>
);

export default FormInput;
