
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  artworkId: number;
  userId: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (artworkId: number) => void;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.artworkId === item.artworkId)
            ? state.items
            : [...state.items, item],
        })),
      removeItem: (artworkId) =>
        set((state) => ({
          items: state.items.filter((item) => item.artworkId !== artworkId),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
