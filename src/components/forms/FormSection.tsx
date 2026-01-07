import React from 'react';

const FormSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      {children}
    </div>
  </div>
);

export default FormSection;
