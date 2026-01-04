import { useUserStore } from "@/stores/useUserStore";

export default class Penalties {

    handler(currentChoice:any, setCurrentNode:any, setData:any) {
        const penaltyTarget = currentChoice.penalty.ability;
        const penaltyValue = currentChoice.penalty.value;
        
        if (penaltyTarget === 'hp') {
            useUserStore.getState().addDamage(penaltyValue);
            setCurrentNode(currentChoice.next);
            setData((prev: any) => ({...prev, type:'penalty', success:false, value:penaltyValue, target:'HP',status:true}));
        }
    }
}
