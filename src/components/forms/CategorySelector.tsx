import React, { useEffect } from 'react';
import { useCategoryStore } from '../../store/categoryStore';

interface CategorySelectorProps {
    value: string;
    onChange: (category: string) => void;
    label?: string;
    required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    value,
    onChange,
    label = 'Categoria',
    required = true
}) => {
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [fetchCategories, categories.length]);

    const activeCategories = categories.filter(c => c.isActive);

    return (
        <div>
            <label className="block text-sm font-medium text-[var(--ios-text)] mb-1.5 pl-1">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[var(--ios-separator)] 
                bg-[var(--ios-fill)] text-[var(--ios-text)]
                focus:ring-2 focus:ring-ios-accent focus:border-transparent
                transition-all duration-200 font-medium"
                required={required}
            >
                <option value="">Selecione uma categoria</option>
                {activeCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelector;
