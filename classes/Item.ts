import { Item as ItemType } from "@/types/types";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useInventoryStore } from "@/stores/useInventoryStore";

export default class Item {
    async useConsumable(item: ItemType) {
        if (item.type !== "consumable") return;
        const currentUser = useUserStore.getState().currentUser;
        const updateCharacter = useCharacterStore.getState().updateCharacter;
        const updateInventory = useInventoryStore.getState().updateInventory;

        const id = currentUser.user_id;
        if (item.effectValue && item.effectTarget) {
            const effectValue = item.effectType === "reduce" ? item.effectValue * -1 : item.effectValue;
            const effectTarget = item.effectTarget;
            const r = await fetch(`/api/users/consumable/${id}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    effectValue: effectValue,
                    effectTarget: effectTarget,
                    slug: item.slug,
                    quantity: item.quantity,
                }),
            });
            const feedback = await r.json();
            if (feedback.success) {
                updateCharacter({ [effectTarget]: feedback.effectTarget });
                updateInventory(feedback.inventory);
            }
            // console.log(feedback);
        }
    }
}