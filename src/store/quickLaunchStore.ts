import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { iconMap } from '../utils/iconMap';

export interface RecentCard {
  id: string;
  title: string;
  iconName: keyof typeof iconMap;
  route: string;
}

interface QuickLaunchState {
  recentCards: RecentCard[];
  addRecentCard: (card: RecentCard) => void;
}

export const useQuickLaunchStore = create<QuickLaunchState>()(
  persist(
    (set) => ({
      recentCards: [],
      addRecentCard: (newCard) =>
        set((state) => {
          // Remove the card if it already exists to move it to the front
          const filteredCards = state.recentCards.filter((card) => card.id !== newCard.id);

          // Add the new card to the beginning of the array
          const updatedCards = [newCard, ...filteredCards];

          // Limit the array to a maximum of 4 items
          const finalCards = updatedCards.slice(0, 4);

          return { recentCards: finalCards };
        }),
    }),
    {
      name: 'quick-launch-storage', // Name for localStorage key
    }
  )
);
