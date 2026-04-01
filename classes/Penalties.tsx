import type { Dispatch, SetStateAction } from 'react'
import { useUserStore } from "@/stores/useUserStore";
import { Choice, Data } from "@/types/types";

export default class Penalties {

    handler(currentChoice: Choice, setData: Dispatch<SetStateAction<Data>>) {
        const penaltyTarget = currentChoice.penalty?.ability;
        const penaltyValue = currentChoice.penalty?.value;

        if (penaltyTarget === 'hp' && penaltyValue !== undefined) {
            useUserStore.getState().addDamage(penaltyValue);
            setData((prev: Data) => ({...prev, type:'penalty', success:false, value:penaltyValue, target:'HP',status:true}));
        }
    }
}
