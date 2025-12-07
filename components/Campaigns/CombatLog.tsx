'use client'
import Bar from "../userStats/HitpointsBar"
import { ProgressBar } from "pixel-retroui"
import { useUserContext } from "@/context/context";
import { useState } from "react";
import { Encounter } from "./NodeTypes";

// used to interpret HTML in JSON
import parse from "html-react-parser";
import { useEffect } from "react";

export default function CombatLog({combatLog, enemyData}: {combatLog:any, enemyData:Encounter|undefined}) {

    const {currentUser} = useUserContext();
    const [enemyFullHealth, setEnemyFullHealth] = useState<number|undefined>();
    const [enemyHealth, setEnemyHealth] = useState<number | undefined>();

    const [userHealthInPercentage, setUserHealthInPercentage] = useState<number>(100)

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


    return(
        <>
        <div className="w-full">
            <div id="healthBars" className="lg:grid! lg:grid-cols-2! flex flex-col">
                <div id="userSide" className="w-[50%] mx-auto flex flex-col justify-between">
                    <div className="text-center flex flex-col">{currentUser.username ?? 'You'} <span>{Math.floor(userHealthInPercentage)}%</span></div>
                    <Bar /> 
                </div>
                <div id="enemySide" className="w-[50%] mx-auto over">
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
            <div className="text-center my-10 ">{parse(combatLog ?? ``)}</div>
        </div>
        
        </>
    )
}