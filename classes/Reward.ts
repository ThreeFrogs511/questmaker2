import { Item } from "@/types/types";
import items from '../assets/items.json'
export default class Reward {
    private items;
    private tempInventory;

    constructor(items:Item[], tempInventory:Item[]) {
        this.items = items;
        this.tempInventory = tempInventory;
    };

    addNewItems() {
        for (let item of this.items) {
            this.tempInventory.push(item)
        };
    }

    
}