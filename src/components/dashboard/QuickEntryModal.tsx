import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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

const DEFAULT_PLATFORMS = [
    { id: 'Uber', name: 'Uber' },
    { id: '99', name: '99' },
];

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

    useEffect(() => {
        fetchPlatforms();
        fetchCategories();
    }, [fetchPlatforms, fetchCategories]);

    const PLATFORMS = storePlatforms.length > 0
        ? storePlatforms.filter(p => p.isActive).map(p => ({ id: p.name, name: p.name }))
        : DEFAULT_PLATFORMS;

    const EXPENSE_CATEGORIES = storeCategories.length > 0
        ? storeCategories.filter(c => c.isActive).map(c => ({ id: c.name.toLowerCase(), name: c.name }))
        : DEFAULT_CATEGORIES;

    useEffect(() => {
        if (PLATFORMS.length > 0 && !platform) setPlatform(PLATFORMS[0].id);
        if (EXPENSE_CATEGORIES.length > 0 && !category) setCategory(EXPENSE_CATEGORIES[0].id);
    }, [PLATFORMS, EXPENSE_CATEGORIES, platform, category]);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
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
        }, 280);
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

    const isRevenue = type === 'revenue';
    const accentColor = isRevenue ? 'rgb(52, 199, 89)' : 'rgb(255, 59, 48)';
    const accentShadow = isRevenue ? 'rgba(52, 199, 89, 0.35)' : 'rgba(255, 59, 48, 0.35)';

    // Cores sólidas para o fundo da sheet — sem transparência
    const sheetBg = 'var(--ios-sheet-bg)';

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop escuro */}
            <div
                className={`absolute inset-0 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
                onClick={handleClose}
            />

            {/* Sheet — fundo SÓLIDO, sem transparência */}
            <div
                className={`relative w-full max-w-md transform transition-transform duration-300
                    ${isClosing ? 'translate-y-full' : 'translate-y-0 animate-sheet-up'}`}
                style={{
                    backgroundColor: sheetBg,
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                    boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5)',
                    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div
                        className="w-9 h-1 rounded-full"
                        style={{ backgroundColor: 'var(--ios-text-tertiary)', opacity: 0.4 }}
                    />
                </div>

                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 pb-3"
                    style={{ borderBottom: `0.5px solid var(--ios-separator)` }}
                >
                    <h2
                        className="text-ios-title3 font-semibold"
                        style={{ color: 'var(--ios-text)', letterSpacing: '-0.43px' }}
                    >
                        {isRevenue ? 'Nova Receita' : 'Nova Despesa'}
                    </h2>
                    <button
                        id="quick-entry-close"
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
                        style={{ backgroundColor: 'var(--ios-fill)', color: 'var(--ios-text-secondary)' }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 pt-5 pb-4 space-y-5">
                    {/* Valor hero */}
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--ios-text-secondary)', letterSpacing: '0.6px' }}
                        >
                            Valor
                        </label>
                        <div className="relative">
                            <div
                                className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none font-bold text-ios-title1"
                                style={{ color: accentColor }}
                            >
                                R$
                            </div>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="0,00"
                                className="block w-full pl-12 pr-4 py-3 text-ios-title1 font-bold bg-transparent focus:ring-0 focus:outline-none"
                                style={{
                                    color: 'var(--ios-text)',
                                    borderBottom: `2px solid ${accentColor}`,
                                    letterSpacing: '-0.5px',
                                }}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Plataforma / Categoria chips */}
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase tracking-wider mb-2.5"
                            style={{ color: 'var(--ios-text-secondary)', letterSpacing: '0.6px' }}
                        >
                            {isRevenue ? 'Plataforma' : 'Categoria'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {isRevenue ? (
                                PLATFORMS.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPlatform(p.id)}
                                        className="px-4 py-2 rounded-full text-ios-callout font-medium transition-all duration-150 active:scale-95"
                                        style={{
                                            background: platform === p.id ? accentColor : 'var(--ios-fill)',
                                            color: platform === p.id ? '#fff' : 'var(--ios-text)',
                                        }}
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
                                        className="px-4 py-2 rounded-full text-ios-callout font-medium transition-all duration-150 active:scale-95"
                                        style={{
                                            background: category === c.id ? accentColor : 'var(--ios-fill)',
                                            color: category === c.id ? '#fff' : 'var(--ios-text)',
                                        }}
                                    >
                                        {c.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Data + Descrição */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'var(--ios-text-secondary)', letterSpacing: '0.6px' }}
                            >
                                Data
                            </label>
                            <input
                                id="quick-entry-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="ios-input text-ios-callout"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'var(--ios-text-secondary)', letterSpacing: '0.6px' }}
                            >
                                Descrição
                            </label>
                            <input
                                id="quick-entry-description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Opcional"
                                className="ios-input text-ios-callout"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-full text-ios-headline font-semibold text-white active:scale-[0.98] transition-transform duration-100"
                        style={{
                            background: accentColor,
                            boxShadow: `0 4px 14px ${accentShadow}`,
                        }}
                    >
                        Salvar Lançamento
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickEntryModal;
