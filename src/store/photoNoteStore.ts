import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface PhotoNote {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  amount: number;
  description: string;
  date: string;
  photo_url: string;
  category: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const PHOTO_NOTE_CATEGORIES = [
  { value: 'abastecimento', label: 'Abastecimento' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'pedagio', label: 'Pedágio' },
  { value: 'estacionamento', label: 'Estacionamento' },
  { value: 'multa', label: 'Multa' },
  { value: 'seguro', label: 'Seguro' },
  { value: 'ipva', label: 'IPVA' },
  { value: 'limpeza', label: 'Limpeza / Estética' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'outros', label: 'Outros' },
];

interface PhotoNoteStore {
  notes: PhotoNote[];
  isLoading: boolean;
  uploading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: { amount: number; description: string; date: string; vehicle_id?: string | null; category: string; notes?: string | null; photoFile: File }) => Promise<void>;
  deleteNote: (id: string, photoUrl: string) => Promise<void>;
}

export const usePhotoNoteStore = create<PhotoNoteStore>((set, get) => ({
  notes: [],
  isLoading: false,
  uploading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('photo_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      set({ notes: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    set({ uploading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // 1. Upload da foto para o Storage
      const fileExt = note.photoFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('note_photos')
        .upload(filePath, note.photoFile);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública da foto
      const { data: { publicUrl } } = supabase.storage
        .from('note_photos')
        .getPublicUrl(filePath);

      // 3. Inserir registro no banco
      const { data, error } = await supabase
        .from('photo_notes')
        .insert([{
          user_id: user.id,
          vehicle_id: note.vehicle_id || null,
          amount: note.amount,
          description: note.description,
          date: note.date,
          photo_url: publicUrl,
          category: note.category || 'outros',
          notes: note.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ notes: [data, ...state.notes] }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ uploading: false });
    }
  },

  deleteNote: async (id, photoUrl) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Extrair path da URL para deletar do storage
      const urlParts = photoUrl.split('/note_photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0];
        await supabase.storage.from('note_photos').remove([filePath]);
      }

      // 2. Deletar registro do banco
      const { error } = await supabase
        .from('photo_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));