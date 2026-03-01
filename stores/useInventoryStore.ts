import {create} from 'zustand';
import { Item } from '@/types/types';

type useInventoryStore = {
    inventory: Array<Item> | null;
    updateInventory: (i: Array<Item>) => void;
}

export const useInventoryStore = create<useInventoryStore>((set) => ({

    inventory: [],
    updateInventory: (i) => set({inventory: i})
}));