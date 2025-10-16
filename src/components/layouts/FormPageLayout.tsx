import React from 'react';
import { LucideIcon } from 'lucide-react';
import PageHeader from '../PageHeader';

interface FormPageLayoutProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const FormPageLayout: React.FC<FormPageLayoutProps> = ({ title, icon, children }) => {
  return (
    <div>
      <PageHeader title={title} icon={icon} />
      {children}
    </div>
  );
};

export default FormPageLayout;
