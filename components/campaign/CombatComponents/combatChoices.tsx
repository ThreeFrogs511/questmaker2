'use client'

import { useCombatStore } from "@/stores/useCombatStore";
import { useEffect, useRef, useState } from "react";

export default function combatChoices({gameplay, setSoundEffectAction} : {gameplay:any, setSoundEffectAction:any}) {

    const userAttacks = [
        {text:"inventory", userDmg:null},
        {text:"punch", userDmg:10}, 
        {text:"fireball", userDmg:10}, 
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



    // combat store
    const hasRoundStarted = useCombatStore(state => state.hasRoundStarted);
    const updateRoundStatus = useCombatStore(state => state.updateRoundStatus);
    const isInventoryOpened = useCombatStore(state => state.isInventoryOpened);
    // 



    return(
        <>
        <div id="combatChoices" className={`grid grid-cols-6 grid-rows-2 lg:grid-cols-12 lg:grid-rows-1 content-center items-center px-2! lg:px-5 gap-2 h-auto mb-2`}>
            {userAttacks.map((item, key) => { 
            return <figure
                key={key}
                onPointerDown={ () => { 
                    if (hasRoundStarted) return;
                        updateRoundStatus(true);
                        gameplay.handlePlayerCombatChoices(item, setSoundEffectAction)
                        .then(() => updateRoundStatus(false));
                }}
                className={
                    hasRoundStarted ?
                    `text-center border-2! cursor-not-allowed!  max-h-full! aspect-square overflow-hidden opacity-50 rounded-lg`
                    :
                    `hover:border-3! text-center border-2! cursor-pointer!  max-h-full! aspect-square overflow-hidden ${(item.text === 'inventory' && isInventoryOpened) ? 'border-amber-400!': 'border-white'} rounded-lg`}
                  >
                {item.text && <img src={`/icons/${item.text.toLowerCase()}.svg`} alt="" className="max-w-full h-auto"/>}
                </figure>
            })}
        </div>
        </>
    )
}