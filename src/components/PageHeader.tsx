import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 flex items-center">
      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-4" />
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
    </div>
  );
};

export default PageHeader;
