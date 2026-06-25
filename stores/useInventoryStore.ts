import {create} from 'zustand';
import { Item } from '@/types/types';

type useInventoryStore = {
    inventory: Array<Item> | null;
    updateInventory: (i: Array<Item>) => void;
    decrementInventory: (slug: string) => void;
    resetInventory: () => void;
}

export const useInventoryStore = create<useInventoryStore>((set) => ({

    inventory: [],
    updateInventory: (i) => set({inventory: i}),
    decrementInventory: (slug) => set((state) => {
        if (!state.inventory) return {};
        const updated = state.inventory
            .map(item => item.slug === slug ? {...item, quantity: (item.quantity ?? 1) - 1} : item)
            .filter(item => (item.quantity ?? 0) > 0);
        return {inventory: updated};
    }),
    resetInventory: () => set({inventory:[]})
}));