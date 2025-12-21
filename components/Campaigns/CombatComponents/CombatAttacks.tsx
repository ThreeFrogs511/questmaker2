'use client'

import { useCombatStore } from "@/stores/useCombatStore";
import { useNarrationStore } from "@/stores/useNarrationStore";
import { useUserStore } from "@/stores/useUserStore";

export default function combatAttacks({gameplay, setSoundEffectAction} : {gameplay:any, setSoundEffectAction:any}) {
    const userAttacks = [
        {text:"inventory", userDmg:null},
        {text:"Punch", userDmg:10}, 
        {text:"Fireball", userDmg:10}, 
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
        ];


    //user store
    const updateStats = useUserStore(state => state.updateStats);

    // narration store
    const updateNode = useNarrationStore(state => state.updateNode);

    // combat store
    const hasRoundStarted = useCombatStore(state => state.hasRoundStarted);
    const updateRoundStatus = useCombatStore(state => state.updateRoundStatus);
    const setNbOfTurn = useCombatStore(state => state.setNbOfTurn);
    const clearNbOfTurn = useCombatStore(state => state.clearNbOfTurn);
    const menuNavigation = useCombatStore(state => state.menuNavigation);
    // 

    return(
        <>
        <div id="combatChoices" className={`grid grid-cols-6 grid-rows-2 lg:grid-cols-12 lg:grid-rows-1 content-center items-center px-2! lg:px-5 gap-2 h-auto mb-2`}>
            {userAttacks.map((item, key) => { 
            return <figure
                key={key}
                onPointerDown={ () => { 
                    if (hasRoundStarted) return;
                    if (item.text === 'return') {
                        menuNavigation('')
                        return;
                    } else {
                        updateRoundStatus(true);
                        gameplay.handlePlayerCombatChoices(item, updateNode, setNbOfTurn, clearNbOfTurn, setSoundEffectAction, updateStats)
                        .then(() => updateRoundStatus(false));
                    }
                }}
                className={
                    hasRoundStarted ?
                    `text-center border-2! cursor-not-allowed!  max-h-full! aspect-square overflow-hidden opacity-50 rounded-lg`
                    :
                    `hover:border-3! text-center border-2! cursor-pointer!   max-h-full! aspect-square overflow-hidden border-white rounded-lg`} >
                {item.text && <img src={`/icons/${item.text.toLowerCase()}.svg`} alt="" className="max-w-full h-auto"/>}
                </figure>
            })}
        </div>
        </>
    )
}