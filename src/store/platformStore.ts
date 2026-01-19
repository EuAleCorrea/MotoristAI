import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Platform {
    id: string;
    name: string;
    color: string;
    isActive: boolean;
    sortOrder: number;
}

interface PlatformStore {
    platforms: Platform[];
    isLoading: boolean;
    error: string | null;
    fetchPlatforms: () => Promise<void>;
    addPlatform: (platform: Omit<Platform, 'id'>) => Promise<void>;
    updatePlatform: (id: string, platform: Partial<Platform>) => Promise<void>;
    deletePlatform: (id: string) => Promise<void>;
    seedDefaultPlatforms: () => Promise<void>;
}

const DEFAULT_PLATFORMS = [
    { name: 'Uber', color: 'bg-black', isActive: true, sortOrder: 0 },
    { name: '99', color: 'bg-yellow-500', isActive: true, sortOrder: 1 },
];

const mapFromDB = (data: any): Platform => ({
    id: data.id,
    name: data.name,
    color: data.color,
    isActive: data.is_active,
    sortOrder: data.sort_order,
});

const mapToDB = (data: Partial<Platform>) => {
    const mapped: any = {};
    if (data.name !== undefined) mapped.name = data.name;
    if (data.color !== undefined) mapped.color = data.color;
    if (data.isActive !== undefined) mapped.is_active = data.isActive;
    if (data.sortOrder !== undefined) mapped.sort_order = data.sortOrder;
    return mapped;
};

export const usePlatformStore = create<PlatformStore>((set, get) => ({
    platforms: [],
    isLoading: false,
    error: null,

    fetchPlatforms: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('platforms')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            const platforms = data?.map(mapFromDB) || [];

            // Se não houver plataformas, criar as padrão
            if (platforms.length === 0) {
                await get().seedDefaultPlatforms();
                return;
            }

            set({ platforms });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addPlatform: async (platform) => {
        set({ isLoading: true, error: null });
        try {
            // Verificar se já existe uma plataforma com o mesmo nome
            const existing = get().platforms.find(
                p => p.name.toLowerCase() === platform.name.toLowerCase()
            );
            if (existing) {
                set({ error: 'Já existe uma plataforma com este nome.' });
                return;
            }

            const dbPlatform = mapToDB(platform);
            const { data, error } = await supabase
                .from('platforms')
                .insert([dbPlatform])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                platforms: [...state.platforms, mapFromDB(data)],
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePlatform: async (id, updatedPlatform) => {
        set({ isLoading: true, error: null });
        try {
            const dbPlatform = mapToDB(updatedPlatform);
            const { data, error } = await supabase
                .from('platforms')
                .update(dbPlatform)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                platforms: state.platforms.map((p) =>
                    p.id === id ? mapFromDB(data) : p
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePlatform: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('platforms')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                platforms: state.platforms.filter((p) => p.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    seedDefaultPlatforms: async () => {
        try {
            // Verificar quais plataformas já existem no banco
            const { data: existingData } = await supabase
                .from('platforms')
                .select('name');

            const existingNames = new Set(
                (existingData || []).map((p: any) => p.name.toLowerCase())
            );

            // Filtrar apenas as plataformas que ainda não existem
            const newPlatforms = DEFAULT_PLATFORMS.filter(
                p => !existingNames.has(p.name.toLowerCase())
            );

            if (newPlatforms.length === 0) {
                // Se todas já existem, apenas buscar do banco
                const { data } = await supabase
                    .from('platforms')
                    .select('*')
                    .order('sort_order', { ascending: true });
                set({ platforms: data?.map(mapFromDB) || [] });
                return;
            }

            const dbPlatforms = newPlatforms.map(mapToDB);
            const { data, error } = await supabase
                .from('platforms')
                .insert(dbPlatforms)
                .select();

            if (error) throw error;

            // Buscar todas as plataformas após o insert
            const { data: allData } = await supabase
                .from('platforms')
                .select('*')
                .order('sort_order', { ascending: true });

            set({ platforms: allData?.map(mapFromDB) || [] });
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
