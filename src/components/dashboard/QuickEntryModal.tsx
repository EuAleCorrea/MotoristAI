import React, { useState } from 'react';
import { X, DollarSign, Calendar, Building } from 'lucide-react';
import { format } from 'date-fns';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';

interface QuickEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'revenue' | 'expense';
}

const PLATFORMS = [
    { id: 'uber', name: 'Uber', color: 'bg-black' },
    { id: '99', name: '99', color: 'bg-yellow-500' },
    { id: 'indrive', name: 'InDrive', color: 'bg-green-500' },
    { id: 'ifood', name: 'iFood', color: 'bg-red-500' },
    { id: 'rappi', name: 'Rappi', color: 'bg-orange-500' },
    { id: 'particular', name: 'Particular', color: 'bg-blue-500' },
];

const EXPENSE_CATEGORIES = [
    { id: 'combustivel', name: 'Combustível' },
    { id: 'manutencao', name: 'Manutenção' },
    { id: 'alimentacao', name: 'Alimentação' },
    { id: 'outros', name: 'Outros' },
];

const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ isOpen, onClose, type }) => {
    const [value, setValue] = useState('');
    const [platform, setPlatform] = useState('uber');
    const [category, setCategory] = useState('combustivel');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const { addEntry } = useEntryStore();
    const { addExpense } = useExpenseStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) return;

        if (type === 'revenue') {
            await addEntry({
                date,
                value: numValue,
                source: platform,
                tripCount: 1,
                kmDriven: 0,
                hoursWorked: '00:00',
                notes: description || `Entrada rápida - ${PLATFORMS.find(p => p.id === platform)?.name}`,
            });
        } else {
            await addExpense({
                date,
                amount: numValue,
                category: EXPENSE_CATEGORIES.find(c => c.id === category)?.name || 'Outros',
                description: description || `Despesa rápida - ${category}`,
            });
        }

        onClose();
        setValue('');
        setDescription('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {type === 'revenue' ? 'Nova Entrada' : 'Nova Despesa'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Platform/Category selector */}
                    {type === 'revenue' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Plataforma
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPlatform(p.id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${platform === p.id
                                                ? 'bg-primary-600 text-white ring-2 ring-primary-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoria
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EXPENSE_CATEGORIES.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setCategory(c.id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${category === c.id
                                                ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Value input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valor (R$)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Date input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Description (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição (opcional)
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Corrida para o aeroporto"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={`w-full py-4 rounded-xl font-semibold text-white transition ${type === 'revenue'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickEntryModal;
