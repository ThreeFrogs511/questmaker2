'use client'
import { useCombatStore } from "@/stores/useCombatStore"
import Engine from "@/classes/Engine";
import { CombatConsumableItem } from "@/types/types";

export default function Inventory({gameplay, setSoundEffectAction} : {gameplay: Engine, setSoundEffectAction: (effect: string | null) => void}) {

    // combat store
    const openInventory = useCombatStore(state => state.openInventory);
    const isInventoryOpened = useCombatStore(state => state.isInventoryOpened);
    const hasRoundStarted = useCombatStore(state => state.hasRoundStarted);
    const updateRoundStatus = useCombatStore(state => state.updateRoundStatus);


    const itemsPlaceholder: CombatConsumableItem[] =
    [
        {type:"item", name:"Health Potion", target:"damage_taken", value:5},
        {type:"item",name:"Dopamine Potion", target:"dopamine_consumed", value:5},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0},
        {type:"item",name:"", target:"", value:0}
    ]

 

    return(
        <>
        <div className="fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-998 flex justify-center items-center">
            <div className="h-[90%] w-[90%] bg-black  overflow-hidden border-4! border-white! rounded-lg! p-5">
                <div 
                className="cursor-pointer"
                onPointerDown={() => openInventory(false)}>
                    Click to close
                </div>
                <div id="itemsList" className="flex flex-wrap gap-1">
                    {itemsPlaceholder.map((item, key) => 
                    <figure 
                    key={key} 
                    className="w-20! min-w-20! hover:border-3! text-center border-2! cursor-pointer! min-h-full! max-h-full! aspect-square overflow-hidden rounded-lg"
                    onPointerDown={() => {
                        if (item.name === "" || hasRoundStarted) return;
                        openInventory(false);
                        updateRoundStatus(true);
                        gameplay.handlePlayerCombatChoices(item, setSoundEffectAction)
                        .then(() => updateRoundStatus(false));
                    }}>
                        {item.name}
                    </figure>
                    )}
                </div>

            </div>
        </div>
        </>
    )
}