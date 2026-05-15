import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import FormInput from '../forms/FormInput';
import MoneyInput from '../forms/MoneyInput';
import PlatformSelector from '../forms/PlatformSelector';
import CategorySelector from '../forms/CategorySelector';

interface QuickEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'revenue' | 'expense';
}

const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ isOpen, onClose, type }) => {
    const [value, setValue] = useState('');
    const [source, setSource] = useState('Uber');
    const [category, setCategory] = useState('Combustível');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSuccess, setIsSuccess] = useState(false);

    const { addEntry, isLoading: entryLoading } = useEntryStore();
    const { addExpense, isLoading: expenseLoading } = useExpenseStore();

    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            document.body.style.overflow = 'hidden';
            // Reset fields
            setValue('');
            setDescription('');
            setDate(format(new Date(), 'yyyy-MM-dd'));
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numValue) || numValue <= 0) return;

        try {
            if (type === 'revenue') {
                await addEntry({
                    date: new Date(date + 'T12:00:00').toISOString(),
                    value: numValue,
                    source: source,
                    tripCount: 0,
                    kmDriven: 0,
                    hoursWorked: '00:00',
                    notes: description || `Entrada rápida - ${source}`,
                });
            } else {
                await addExpense({
                    date: new Date(date + 'T12:00:00').toISOString(),
                    amount: numValue,
                    category: category,
                    description: description || `Despesa rápida - ${category}`,
                });
            }

            setIsSuccess(true);
            setTimeout(handleClose, 1500);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const isRevenue = type === 'revenue';
    const isLoading = entryLoading || expenseLoading;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-0">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 backdrop-blur-[2px]"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                onClick={handleClose}
            />

            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ 
                    type: 'spring',
                    damping: 25,
                    stiffness: 200,
                    mass: 0.8
                }}
                className="relative w-full max-w-lg"
                style={{
                    backgroundColor: 'var(--ios-sheet-bg)',
                    borderTopLeftRadius: '2rem',
                    borderTopRightRadius: '2rem',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 20px)',
                    border: '1px solid var(--ios-separator)',
                    borderBottom: 'none'
                }}
            >
                {/* Modal Handle */}
                <div className="flex flex-col items-center pt-3 mb-2">
                    <div className="w-12 h-1.5 rounded-full bg-ios-text-tertiary opacity-30 mb-4" />
                </div>

                {isSuccess ? (
                    <div className="px-6 py-12 flex flex-col items-center text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-sys-green/10 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-sys-green" />
                        </div>
                        <h2 className="text-2xl font-bold text-ios-text mb-2">Lançamento Salvo!</h2>
                        <p className="text-ios-body text-ios-text-secondary">Seu registro foi processado com sucesso.</p>
                    </div>
                ) : (
                    <div className="px-6 pb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-ios-text tracking-tight">
                                {isRevenue ? 'Novo Ganho' : 'Nova Despesa'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-ios-fill text-ios-text-secondary active:scale-90 transition-transform"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4 bg-ios-card rounded-3xl p-5 border border-ios-separator">
                                <MoneyInput
                                    id="value"
                                    name="value"
                                    label="Valor"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="0,00"
                                    required
                                    autoFocus
                                    icon={<span className="font-bold" style={{ color: isRevenue ? 'var(--sys-green)' : 'var(--sys-red)' }}>R$</span>}
                                />

                                {isRevenue ? (
                                    <PlatformSelector
                                        value={source}
                                        onChange={setSource}
                                    />
                                ) : (
                                    <CategorySelector
                                        value={category}
                                        onChange={setCategory}
                                    />
                                )}
                            </div>

                            <div className="space-y-4 bg-ios-card rounded-3xl p-5 border border-ios-separator">
                                <FormInput
                                    id="date"
                                    name="date"
                                    label="Data"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    icon={<Calendar className="w-4 h-4" />}
                                />

                                <FormInput
                                    id="description"
                                    name="description"
                                    label="Descrição"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Almoço, Manutenção..."
                                    icon={<FileText className="w-4 h-4" />}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 rounded-[2rem] text-ios-headline font-bold text-white shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                                    style={{
                                        background: isRevenue ? 'var(--sys-green)' : 'var(--sys-red)',
                                        boxShadow: `0 8px 24px ${isRevenue ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'}`,
                                    }}
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar Lançamento'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QuickEntryModal;
