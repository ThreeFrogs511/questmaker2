import type { Dispatch, SetStateAction } from 'react'
import { useCharacterStore } from "@/stores/useCharacterStore";
import { Choice, ChoiceResult } from "@/types/types";

export default class Penalties {

    handler(currentChoice: Choice, setChoiceResult: Dispatch<SetStateAction<ChoiceResult>>) {
        const penaltyTarget = currentChoice.penalty?.ability;
        const penaltyValue = currentChoice.penalty?.value;

        if (penaltyTarget === 'hp' && penaltyValue !== undefined) {
            useCharacterStore.getState().addDamage(penaltyValue);
            setChoiceResult((prev: ChoiceResult) => ({...prev, type:'penalty', success:false, value:penaltyValue, target:'HP',status:true}));
        }
    }
}
