import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { usePlatformStore } from '../../store/platformStore';
import { useCategoryStore } from '../../store/categoryStore';

interface QuickEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'revenue' | 'expense';
}

// Fallback para plataformas padrão
const DEFAULT_PLATFORMS = [
    { id: 'Uber', name: 'Uber', color: 'bg-black' },
    { id: '99', name: '99', color: 'bg-yellow-500' },
];

// Fallback para categorias padrão
const DEFAULT_CATEGORIES = [
    { id: 'combustivel', name: 'Combustível' },
    { id: 'eletricidade', name: 'Eletricidade' },
];

const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ isOpen, onClose, type }) => {
    const [value, setValue] = useState('');
    const [platform, setPlatform] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isClosing, setIsClosing] = useState(false);

    const { addEntry } = useEntryStore();
    const { addExpense } = useExpenseStore();
    const { platforms: storePlatforms, fetchPlatforms } = usePlatformStore();
    const { categories: storeCategories, fetchCategories } = useCategoryStore();

    // Carrega dados do store
    useEffect(() => {
        fetchPlatforms();
        fetchCategories();
    }, [fetchPlatforms, fetchCategories]);

    // Usa dados do store ou fallback
    const PLATFORMS = storePlatforms.length > 0
        ? storePlatforms.filter(p => p.isActive).map(p => ({ id: p.name, name: p.name, color: p.color }))
        : DEFAULT_PLATFORMS;

    const EXPENSE_CATEGORIES = storeCategories.length > 0
        ? storeCategories.filter(c => c.isActive).map(c => ({ id: c.name.toLowerCase(), name: c.name }))
        : DEFAULT_CATEGORIES;

    // Define valores iniciais quando os dados carregam
    useEffect(() => {
        if (PLATFORMS.length > 0 && !platform) {
            setPlatform(PLATFORMS[0].id);
        }
        if (EXPENSE_CATEGORIES.length > 0 && !category) {
            setCategory(EXPENSE_CATEGORIES[0].id);
        }
    }, [PLATFORMS, EXPENSE_CATEGORIES, platform, category]);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setValue('');
            setDescription('');
        }, 300); // Animation duration
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) return;

        if (type === 'revenue') {
            await addEntry({
                date: new Date(date + 'T00:00:00').toISOString(),
                value: numValue,
                source: platform,
                tripCount: 1,
                kmDriven: 0,
                hoursWorked: '00:00',
                notes: description || `Entrada rápida - ${PLATFORMS.find(p => p.id === platform)?.name}`,
            });
        } else {
            await addExpense({
                date: new Date(date + 'T00:00:00').toISOString(),
                amount: numValue,
                category: EXPENSE_CATEGORIES.find(c => c.id === category)?.name || 'Outros',
                description: description || `Despesa rápida - ${category}`,
            });
        }

        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            />

            {/* Modal / Bottom Sheet */}
            <div
                className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-transform duration-300 ${isClosing ? 'translate-y-full sm:scale-95 sm:opacity-0' : 'translate-y-0 sm:scale-100 sm:opacity-100'
                    } animate-slide-up sm:animate-none`}
            >
                {/* Mobile Handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {type === 'revenue' ? 'Nova Receita' : 'Nova Despesa'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Value input - Main Focus */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                            Valor
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none font-bold text-2xl ${type === 'revenue' ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                R$
                            </div>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="0,00"
                                className={`block w-full pl-10 pr-4 py-4 text-4xl font-bold bg-transparent border-b-2 focus:ring-0 focus:outline-none transition-colors ${type === 'revenue'
                                    ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 text-gray-900 dark:text-white placeholder-gray-300'
                                    : 'border-gray-200 dark:border-gray-700 focus:border-rose-500 text-gray-900 dark:text-white placeholder-gray-300'
                                    }`}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Platform/Category selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                            {type === 'revenue' ? 'Plataforma' : 'Categoria'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {type === 'revenue' ? (
                                PLATFORMS.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPlatform(p.id)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${platform === p.id
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))
                            ) : (
                                EXPENSE_CATEGORIES.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setCategory(c.id)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${category === c.id
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {c.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Extra Fields Collapsible/Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                                Data
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                                Descrição
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Opcional"
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={`w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg shadow-gray-200 dark:shadow-none transition-transform active:scale-[0.98] ${type === 'revenue'
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 dark:shadow-none'
                            : 'bg-rose-600 hover:bg-rose-500 shadow-rose-200 dark:shadow-none'
                            }`}
                    >
                        Salvar Lançamento
                    </button>

                    {/* Padding for iPhone Home Indicator */}
                    <div className="h-4 sm:hidden" />
                </form>
            </div>
        </div>
    );
};

export default QuickEntryModal;
