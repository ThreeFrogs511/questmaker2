'use client'
import HitpointsBar from "../../userStats/HitpointsBar"
import { ProgressBar } from "pixel-retroui"
import { useState} from "react";

import CombatChoices from "./combatChoices";
import Inventory from "./Inventory";

// used to interpret HTML in JSON
import parse from "html-react-parser";
import { useEffect } from "react";

import useSound from "use-sound";

import { useUserStore } from "@/stores/useUserStore";
import { useCombatStore } from "@/stores/useCombatStore";

export default function CombatInterface({gameplay}: {gameplay:any}) {


    // combat store
    const combatLog = useCombatStore(state => state.combatLog);
    const enemy = useCombatStore(state => state.enemy);
    const nbOfTurn = useCombatStore(state => state.nbOfTurn);
    const hasRoundStarted = useCombatStore(state => state.hasRoundStarted);
    const isInventoryOpened = useCombatStore(state => state.isInventoryOpened);

    // local states
    const [enemyFullHealth, setEnemyFullHealth] = useState<number|undefined>();
    const [enemyHealth, setEnemyHealth] = useState<number | undefined>();
    const [userHealthInPercentage, setUserHealthInPercentage] = useState<number>(100)
    const [loader, setLoaoder] = useState(false);

    // player store
    const currentUser = useUserStore(state => state.currentUser);

    //loader
    useEffect(() => {
        setTimeout(() => {
            setLoaoder(true);
        }, 50);

    },[])


    // calculating based enemy Hp to determine the 100% value of the progress bar value
    useEffect(() => {
        if (enemy && enemy.hp) {
            const hp = enemy.hp;
            setEnemyFullHealth(hp);
        };
    }, [])

    // calculating the reduction of enemy heath each times they take a hit
    useEffect(() => {
        if (enemy && enemy.hp && enemyFullHealth) {
            setEnemyHealth(enemy.hp/enemyFullHealth);
        }
    }, [enemy?.hp, enemyFullHealth])



    // converting user hp and damage_taken to % of hp
      useEffect(() => {
        if (currentUser && currentUser.hp) {
            const percentage = ((currentUser.hp-currentUser.damage_taken)/currentUser.hp)*100;
            setUserHealthInPercentage(percentage<0 ? 0 : percentage);
        }
    }, [currentUser.damage_taken])

    const [soundEffect, setSoundEffect] = useState<string | null>(null)
        
    const [play, {stop}] = useSound(`/sounds/${soundEffect ? soundEffect : 'blank'}.m4a`, {
        volume: 1,
        interrupt:true,
        preload:true
    })

    useEffect(() => {
    if (!soundEffect) return;
    play();
    return () => {
        stop()
    };

    }, [play, stop])


        

    return(
        <>

        {!loader && <div id="loaderHider" className="fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-998 bg-black"></div>}

        <section id="combatInterface" className="fixed w-dvw h-dvh top-0 bottom-0 right-0 left-0 flex flex-col bg-black">
            <h2 id="turn" className=" lg:text-4xl! font-bold font-minecraft text-center  h-[5dvh] mt-5!">Turn <span className="text-amber-400">{nbOfTurn}</span></h2>
            { !hasRoundStarted ? <h3 className=" mt-1! lg:text-2xl! font-bold font-minecraft text-center  max-h-[5dvh] h-[5dvh]">Make a move !</h3> : <div className=" mt-1! min-h-[5dvh]"></div>}
            <div id="arena" className=" h-[80dvh]">
                <div id="healthBars" className="flex items-center h-[70%] ">
                    <div id="userSide" className="w-[80%] lg:w-[50%] mx-auto">
                        <div className="text-center flex flex-col">{currentUser.username ?? 'You'} 
                            <span>AC : {currentUser.ac}</span>
                            <span>{Math.floor(currentUser.hp ? (currentUser.hp-currentUser.damage_taken) : 10-currentUser.damage_taken)+'/'+currentUser.hp}</span>
                        </div>
                        <div className="w-[70%] mx-auto"><HitpointsBar /></div>
                    </div>
                    <div className="w-[10%] h-full flex items-center justify-center font-minecraft text-xl">VS</div>
                    <div id="enemySide" className="w-[80%] lg:w-[50%]  mx-auto">
                        <div className="text-center flex flex-col justify-between">{enemy?.name} 
                            <span>AC : {enemy?.ac ?? 10}</span> 
                            <span>
                                {enemy
                                    ? `${Math.max(0, Math.floor(enemy.hp ?? 0))}/${enemyFullHealth ?? 0}`
                                    : null
                                }
                            </span>
                        </div>
                        <div className="w-[70%] mx-auto">
                            <ProgressBar
                                size="sm"
                                color="red"
                                borderColor="white"
                                className="w-full"
                                progress={(enemyFullHealth && enemyHealth && enemy?.hp) ? (enemy.hp > 0 ? enemyHealth*100 : 0) : 0}
                            />
                        </div>
                    </div>
                </div>
                <div id="combatLog" className="h-[30%]">
                    <div className="text-center mt-5">{parse(combatLog ?? ``)}</div>
                </div>
            </div>
            <CombatChoices gameplay={gameplay} setSoundEffectAction={setSoundEffect}/>
            {isInventoryOpened && <Inventory gameplay={gameplay} setSoundEffectAction={setSoundEffect}/>}        
            </section>
        
        </>
    )
}