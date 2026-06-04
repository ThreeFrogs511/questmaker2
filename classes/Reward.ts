import { Item } from "@/types/types";
import { useCombatStore } from "@/stores/useCombatStore";

export default class Reward {
    private items;

    constructor(items:Item[] ) {
        this.items = items;;
    };

    addNewItems() {
        const tempInventory = useCombatStore.getState().tempInventory;
        for (let item of this.items) {
            tempInventory?.push(item);
        };
        useCombatStore.getState().updateTempInventory(tempInventory ?? []);
    };

    learnNewSkill() {
        // const tempMovesets = useCombatStore.getState().tempMovesets;
        // for (let mov)

    }

    
}