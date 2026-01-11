import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Category {
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
    sortOrder: number;
}

interface CategoryStore {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    seedDefaultCategories: () => Promise<void>;
}

const DEFAULT_CATEGORIES = [
    { name: 'Combustível', icon: 'fuel', isActive: true, sortOrder: 0 },
    { name: 'Eletricidade', icon: 'zap', isActive: true, sortOrder: 1 },
];

const mapFromDB = (data: any): Category => ({
    id: data.id,
    name: data.name,
    icon: data.icon,
    isActive: data.is_active,
    sortOrder: data.sort_order,
});

const mapToDB = (data: Partial<Category>) => {
    const mapped: any = {};
    if (data.name !== undefined) mapped.name = data.name;
    if (data.icon !== undefined) mapped.icon = data.icon;
    if (data.isActive !== undefined) mapped.is_active = data.isActive;
    if (data.sortOrder !== undefined) mapped.sort_order = data.sortOrder;
    return mapped;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('expense_categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            const categories = data?.map(mapFromDB) || [];

            // Se não houver categorias, criar as padrão
            if (categories.length === 0) {
                await get().seedDefaultCategories();
                return;
            }

            set({ categories });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (category) => {
        set({ isLoading: true, error: null });
        try {
            const dbCategory = mapToDB(category);
            const { data, error } = await supabase
                .from('expense_categories')
                .insert([dbCategory])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                categories: [...state.categories, mapFromDB(data)],
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateCategory: async (id, updatedCategory) => {
        set({ isLoading: true, error: null });
        try {
            const dbCategory = mapToDB(updatedCategory);
            const { data, error } = await supabase
                .from('expense_categories')
                .update(dbCategory)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                categories: state.categories.map((c) =>
                    c.id === id ? mapFromDB(data) : c
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('expense_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    seedDefaultCategories: async () => {
        try {
            const dbCategories = DEFAULT_CATEGORIES.map(mapToDB);
            const { data, error } = await supabase
                .from('expense_categories')
                .insert(dbCategories)
                .select();

            if (error) throw error;
            set({ categories: data?.map(mapFromDB) || [] });
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
