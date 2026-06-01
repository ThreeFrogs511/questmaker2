import type { Dispatch, SetStateAction } from 'react'
import { Choice, ChoiceResult} from "@/types/types";
import { useCombatStore } from '@/stores/useCombatStore';

export default class Penalties {

    private updateTempPlayerData = useCombatStore.getState().updateTempPlayerData;
    private tempPlayerData = useCombatStore.getState().tempPlayerData;

    handler(currentChoice: Choice, setChoiceResult: Dispatch<SetStateAction<ChoiceResult>>) {
        const penaltyTarget = currentChoice.penalty?.ability;
        const penaltyValue = currentChoice.penalty?.value;

        if (penaltyTarget === 'hp' && penaltyValue !== undefined) {
            const totalDamage = this.tempPlayerData.damage_taken + penaltyValue;
            this.updateTempPlayerData({damage_taken:totalDamage});
            setChoiceResult((prev: ChoiceResult) => ({...prev, type:'penalty', success:false, value:penaltyValue, target:'HP',status:true}));
        }
    }
}
