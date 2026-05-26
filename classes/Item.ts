import { Store, User } from "@/types/types";
import { useUserStore } from "@/stores/useUserStore";
import { useInventoryStore } from "@/stores/useInventoryStore";


export default class Item  {


    async useConsumable(item:Store) {
        if (item.type !== "consumable") return;
        const currentUser = useUserStore.getState().currentUser;
        const updateStats = useUserStore.getState().updateStats;
        const updateInventory = useInventoryStore.getState().updateInventory;
    
        const id = currentUser.id;
        if (item.effectValue && item.effectTarget) {
            const effectValue = item.effectType == "reduce" ? item.effectValue*-1 : item.effectValue;
            const effectTarget = item.effectTarget as keyof User;
            const r = await fetch(`/api/users/consumable/${id}`, {
                method: "PATCH",
                headers:{"content-type": "application/json"},
                body: JSON.stringify({
                    effectValue:effectValue,
                    effectTarget:effectTarget,
                    slug:item.slug,
                    quantity:item.quantity
                })
            })
            const feedback = await r.json();
            if (feedback.success) {
                updateStats({[effectTarget]: Number(effectValue)});
                updateInventory(feedback.inventory);
            
            } 
            console.log(feedback)
        }
    }
}