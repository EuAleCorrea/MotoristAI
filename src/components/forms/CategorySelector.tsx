import React, { useEffect } from 'react';
import { useCategoryStore } from '../../store/categoryStore';
import { AppSelect } from './AppSelect';

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

  const activeCategories = categories
    .filter(c => c.isActive)
    .filter((cat, idx, arr) => arr.findIndex(c => c.name === cat.name) === idx);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ios-text)] mb-1.5 pl-1">
        {label}
      </label>
      <AppSelect
        value={value}
        onValueChange={onChange}
        placeholder="Selecione uma categoria"
        options={activeCategories.map((category) => ({
          value: category.name,
          label: category.name,
        }))}
      />
    </div>
  );
};

export default CategorySelector;
