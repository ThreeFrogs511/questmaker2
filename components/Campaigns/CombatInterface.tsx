'use client'
import Bar from "../userStats/HitpointsBar"
import { ProgressBar } from "pixel-retroui"
import { useUserContext } from "@/context/context";
import { useState, useRef } from "react";
import { Encounter, Nodes } from "./NodeTypes";

// used to interpret HTML in JSON
import parse from "html-react-parser";
import { useEffect } from "react";

import useSound from "use-sound";

export default function CombatInteface(
{ combatLog, enemyData, gameplay, currentNode, setCurrentNodeAction}: 
{   
combatLog:any, 
enemyData:Encounter|undefined, 
gameplay:any, 
currentNode:keyof Nodes | undefined,
setCurrentNodeAction:React.Dispatch<React.SetStateAction<keyof Nodes | undefined>>
}
) {

  


    const {currentUser} = useUserContext();
    const [enemyFullHealth, setEnemyFullHealth] = useState<number|undefined>();
    const [enemyHealth, setEnemyHealth] = useState<number | undefined>();

    const [userAC, setUserAC] = useState(11);
    const [enemyAC, setEnemyAC] = useState(10);

    const [userHealthInPercentage, setUserHealthInPercentage] = useState<number>(100)

    const userAttacks = [{text:"Punch", userDmg:10}, {text:"Fireball", userDmg:10}, {text:"Return", userDmg:null}];
    const userMoves = ["Attacks", "Inventory"]

    const [nbOfTurn, setNbOfTurn] = useState(1);
    const [soundEffect, setSoundEffect] = useState<string | null>(null)

    const [play, {stop}] = useSound(`/sounds/${soundEffect ? soundEffect : 'blank'}.m4a`, {
    interrupt:true
    })

    // calculating based enemy Hp to determine the 100% value of the progress bar value
    useEffect(() => {
        if (enemyData && enemyData.hp) {
            setEnemyFullHealth(enemyData.hp);
        };
    }, [])

    // calculating the reduction of enemy heath each times they take a hit
    useEffect(() => {
        if (enemyData && enemyData.hp && enemyFullHealth) {
            setEnemyHealth(enemyData.hp/enemyFullHealth);
        }
    }, [enemyData?.hp, enemyFullHealth])

    // converting user hp and damage_taken to % of hp
    useEffect(() => {
        const p = 1-currentUser.damage_taken/100;
        const v= currentUser.hp && currentUser.hp*p;
        const finalValue = currentUser.hp && v && v/currentUser.hp;
        setUserHealthInPercentage(finalValue ? finalValue*100 : 0);

    }, [currentUser.hp, currentUser.damage_taken])

    useEffect(() => {
        if (!soundEffect) return;
       
        play();
        return () => {
            stop()
        };

    }, [play, stop, soundEffect])


    return(
        <>
        <section id="combatInterface" className="fixed w-dvw h-dvh top-0 bottom-0 right-0 left-0 flex flex-col bg-black">
            <h2 id="turn" className=" lg:text-4xl! font-bold font-minecraft text-center text-amber-400 h-[10dvh] mt-5!">Turn {nbOfTurn}</h2>
            <div id="arena" className=" h-[50dvh]">
                <div id="healthBars" className="flex items-center h-[70%] ">
                    <div id="userSide" className="w-[80%] lg:w-[50%] mx-auto">
                        <div className="text-center flex flex-col">{currentUser.username ?? 'You'} <span>AC : {userAC}</span><span>{Math.floor(userHealthInPercentage)}%</span></div>
                        <div className="w-[70%] mx-auto"><Bar /> </div>
                    </div>
                    <div className="w-[10%]  h-full flex items-center justify-center font-minecraft text-xl">VS</div>
                    <div id="enemySide" className="w-[80%] lg:w-[50%]  mx-auto">
                        <div className="text-center flex flex-col justify-between">{enemyData?.name} <span>AC : {userAC}</span> <span>{Math.floor((enemyFullHealth && enemyHealth && enemyData?.hp) ? (enemyData.hp > 0 ? enemyHealth*100 : 0) : 0)}%</span></div>
                        <div className="w-[70%] mx-auto">
                            <ProgressBar
                                size="md"
                                color="green"
                                borderColor="white"
                                className="w-full"
                                progress={(enemyFullHealth && enemyHealth && enemyData?.hp) ? (enemyData.hp > 0 ? enemyHealth*100 : 0) : 0}
                            />
                        </div>
                    </div>
                </div>
                <div id="combatLog" className="h-[30%]">
                    <div className="text-center mt-5">{parse(combatLog ?? ``)}</div>
                </div>
            </div>
            <div id="combatChoices" className=" h-[50dvh]">
                <div className=" grid grid-cols-1">
                {userAttacks.map((item, key) => { 
                return <button 
                    key={key}
                    onPointerDown={ () => { 
                        item.text !== 'Return' ? gameplay.handlePlayerCombatChoices(item, setCurrentNodeAction, setNbOfTurn, setSoundEffect) : console.log("return");
                    }}
                    className="hover:outline-2! border-2! my-1! border-white lg:border-0! outline-white! rounded-lg p-4! text-left">
                    <div className="flex items-center grow">
                    <span className="text-amber-400 font-bold mr-3 text-xl">{key+1}.</span>
                    <div>
                    <h3 className="text-white font-semibold mb-1 text-xs! lg:text-xl!">{parse(item.text)}</h3>
                    </div>
                    </div>
                </button>
                })}
            </div>
            </div>

  
        </section>
        
        </>
    )
}


      {/* <div id="combatInterface" className="w-full h-[80%]">
            <div id="healthBars" className="grid! grid-cols-2! ">
                <div id="userSide" className="w-[80%] lg:w-[50%] mx-auto flex flex-col justify-between">
                    <div className="text-center flex flex-col">{currentUser.username ?? 'You'} <span>{Math.floor(userHealthInPercentage)}%</span></div>
                    <Bar /> 
                </div>
                <div id="enemySide" className="w-[80%] lg:w-[50%] mx-auto">
                    <div className="text-center flex flex-col justify-between">{enemyData?.name} <span>{Math.floor((enemyFullHealth && enemyHealth && enemyData?.hp) ? (enemyData.hp > 0 ? enemyHealth*100 : 0) : 0)}%</span></div>
                    <ProgressBar
                        size="md"
                        color="green"
                        borderColor="white"
                        className="w-full"
                        progress={(enemyFullHealth && enemyHealth && enemyData?.hp) ? (enemyData.hp > 0 ? enemyHealth*100 : 0) : 0}
                    />
                </div>
            </div>
            <div className="text-center mt-5">{parse(combatLog ?? ``)}</div>
        </div> */}