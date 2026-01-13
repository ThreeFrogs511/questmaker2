import { useUserStore } from "@/stores/useUserStore";

export default class Penalties {

    handler(currentChoice:any, setData:any) {
        const penaltyTarget = currentChoice.penalty.ability;
        const penaltyValue = currentChoice.penalty.value;
        
        if (penaltyTarget === 'hp') {
            useUserStore.getState().addDamage(penaltyValue);
            setData((prev: any) => ({...prev, type:'penalty', success:false, value:penaltyValue, target:'HP',status:true}));
        }
    }
}
