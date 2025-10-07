import { create } from 'zustand';

type ModalType = 'trip' | 'expense' | 'add-choice' | 'goal' | null;

interface ModalState {
  modalType: ModalType;
  editingData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  editingData: null,
  openModal: (type, data = null) => set({ modalType: type, editingData: data }),
  closeModal: () => set({ modalType: null, editingData: null }),
}));
