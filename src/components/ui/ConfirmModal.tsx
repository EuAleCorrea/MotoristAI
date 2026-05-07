import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-[280px] bg-[var(--ios-card)] rounded-[20px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-[var(--ios-text)] mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-[14px] text-[var(--ios-text-secondary)] leading-normal">
            {message}
          </p>
        </div>
        
        <div className="flex border-t border-[var(--ios-separator)]">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-[17px] font-medium text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] active:opacity-60 transition-all border-r border-[var(--ios-separator)]"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3.5 text-[17px] font-bold hover:bg-[var(--ios-fill)] active:opacity-60 transition-all ${
              variant === 'danger' ? 'text-[var(--sys-red)]' : 'text-[var(--ios-accent)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
