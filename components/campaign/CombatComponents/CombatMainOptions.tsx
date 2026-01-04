'use client'

import { useCombatStore } from "@/stores/useCombatStore";


export default function CombatMainOptions({gameplay}:{gameplay:any}) {

    const menuNavigation = useCombatStore(state => state.menuNavigation);

    const options = ["attack", "inventory"];
    return (
    <>
    <div id="mainChoices" className={`grid grid-cols-6 grid-rows-2 lg:grid-cols-12 lg:grid-rows-1 content-center items-center px-2! lg:px-5 gap-2 h-auto mb-2`}>
    {options.map((item, key) => { 
    return <figure
        key={key}
        onPointerDown={ () => { 
        if (item === "attack") {
            menuNavigation(item);
            return;
        }
    }}
    className={`hover:border-3! text-center border-2! cursor-pointer! max-h-full! aspect-square overflow-hidden border-white rounded-lg`} >
        {item && <img src={`/icons/${item.toLowerCase()}.svg`} alt="" className="max-w-full h-auto"/>}
    </figure>
    })}
    </div>
    </>
    )
}