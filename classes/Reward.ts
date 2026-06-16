import { Item, Moveset } from "@/types/types";
import { useCombatStore } from "@/stores/useCombatStore";
import movesetsTemplate from '@/assets/movesets.json';
import items from '@/assets/items.json';
import { useCharacterStore } from "@/stores/useCharacterStore";

type rewardsType = {
    type:string;
    slug?:string;
    quantity?: number;
    name?: string;
};

export default class Reward {
    private rewards;

    constructor(rewards:rewardsType[]) {
        this.rewards = rewards;;
    };

    handler() {
        for (let reward of this.rewards) {
            if (reward.type === "item") {
                this.addNewItems(reward);
            } else if (reward.type ==="moveset") {
                this.learnNewSkill(reward);
            }
        }
    }

    addNewItems(reward:rewardsType) {
        const tempInventory = useCombatStore.getState().tempInventory;
        const newItem = items.find(n => n.slug === reward.slug) as Item;
        if (!newItem) return;
        newItem.equipped = false;
        newItem.quantity=1;
        const duplicate = tempInventory?.find(n => n.slug === newItem.slug);
        if (duplicate) {
            const updated = tempInventory?.map(n => {
                if (n.slug === newItem.slug) {
                    return { ...n, quantity: (Number(n.quantity) ?? 1) + 1 };
                }
                return n;
            });
            useCombatStore.getState().updateTempInventory(updated ?? []);

        } else {
            tempInventory?.push(newItem);
            useCombatStore.getState().updateTempInventory(tempInventory ?? []);
        };
    };

    learnNewSkill(reward:rewardsType) {
        const movesetsDuringCampaign: Moveset[] = useCombatStore.getState().tempMovesets
        const duplicate = movesetsDuringCampaign.find(n => n.name === reward.name);
        if (duplicate) return;
        
        const character_id = useCharacterStore.getState().character.character_id;
        const newSkill = movesetsTemplate.find(n => n.name === reward.name) as Moveset;
        if (!newSkill || !character_id) return;
        newSkill.is_skill_activated = true;
        newSkill.character_id = character_id;

        const updatedTempMovesets: Moveset[] = movesetsDuringCampaign
        .filter(n => n.type)
        .map(n=> ({...n, character_id:character_id}))
        console.log(updatedTempMovesets)
        updatedTempMovesets.push(newSkill);
        while (updatedTempMovesets.length < 12) {
            updatedTempMovesets.push({});
        };
        useCombatStore.getState().updateTempMovesets([...updatedTempMovesets])

    }

    
}