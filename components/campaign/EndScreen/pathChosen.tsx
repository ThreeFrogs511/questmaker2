'use client'

import { useEffect, useState } from "react";
import Engine from "@/classes/Engine";

export default function pathChosen({gameplay} : {gameplay: Engine}) {

    const relevantChoices = gameplay.getRelevantChoices();
    const [displayedChoices, setDisplayedChoices] = useState<Array<{node:string, text:string}>>([]);
    const [choicesAllDisplayed, setChoicesAllDisplayed] = useState(false);

    // console.log(relevantChoices[0])
   

    // terminer système apparition avec délai des choix et bouton "next"
    useEffect(() => {
        let i = 0;
        let array = [];
       const interval = setInterval(() => {
            array.push(relevantChoices[i])
            if (i> relevantChoices.length-1) {
                setChoicesAllDisplayed(true);
                clearInterval(interval);
            } else {
                i++;
            }
        }, 500);

        () => clearInterval(interval);
    }, [])

    return(
        <>
            <div className="w-[90%] mx-auto h-[20%] max-h-[20%] flex flex-col justify-center">
                <h1 className="text-2xl! lg:text-4xl! mt-5! font-bold text-center font-minecraft text-amber-400">
                    Your important decisions
                </h1>
                <h2 className="text-center text-amber-300 text-xl! mt-2!">These choices will have lasting consequences</h2>
            </div>
            <div className="h-[50%] w-[90%] lg:w-[70%] mx-auto max-h-full flex flex-col justify-center">
                <div id="pathChosenContainer">
                { relevantChoices.map((choice:{node:string, text:string}, index:number) => (
                    <p
                    key={index}
                    className="text-2xl! lg:text-3xl! mb-5! lg:mb-10! lg:text-center"
                    >
                        {choice.text}
                    </p>
                ))
                }
                </div>
            </div>
    
        </>
    )
}