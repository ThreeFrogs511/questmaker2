'use client'
import { Card } from "pixel-retroui"
import { useEffect, useState, useRef } from "react";
import dialog from '../../assets/characterCreationDialogue.json'
// import racesList from '../../assets/racesList.json'
import Scene from "@/components/intro/Scene";

export default function characterCreation() {

    
    // counter to display the next dialogue based on the index number of the JSON array
    let dialogOrder = useRef(0);

    // text to be typed
    const [text, setText] = useState<string | undefined>(dialog[dialogOrder.current].body);

    // store the dialogs from text state
    const [displayedDialog, setDisplayedDialog] = useState<string | undefined>('');

    // prevent string bug with the typewriter effect
    const [isTyping, setIsTyping] = useState(true);

    // authorize dialog skips
    const [isDialogDone, setIsDialogDone] = useState(false);

    // counter for the typing machine effect
    let counter = useRef(-1);

    // handle what needs to be displayed visually based on the dialog
    const [changingVisuals, setChangingVisuals] = useState<number | null>(null);

    //handles which race the player chooses and the description of each
    const [selectedRace, setSelectedRace] = useState<string | null>(null);


    function dialogSequencing(dialogId:number) {
        if (dialogId === 3 ) {
            setChangingVisuals(dialogOrder.current);
            
            
        } else {
            setIsDialogDone(true);
        }
    }

    // function whichDialogToDisplay() {
    //     if (dialogOrder.current === 3) {
    //         switch (selectedRace) {
    //             case "Elf": 
    //             return racesList[0].description;
    //             // break;

    //             case "Half-elf" : return racesList[1].description;
    //             // break;

    //             case "Human" : return racesList[2].description;
    //             // break;

    //             case "Dwarf" : return racesList[3].description;
    //             // break;

    //             case "Felinois" : return racesList[4].description;
    //             // break;

    //             case "Orc" : return racesList[5].description;
    //             // break;

    //             default: return '';
    //         }
    //     } else {
    //         return dialog[dialogOrder.current].body;
    //     }
    // }

    // function typewriterEffect() {
    //     const intervalId = setInterval(() => {
    //         if (isTyping) {

    //             // define the dialog content
    //             let dialogBody = whichDialogToDisplay();
    //             // console.log(selectedRace)

    //             // define the dialog id 
    //             let dialogId= dialog[dialogOrder.current].dialog_id;

    //             // lock system to prevent duplicate
    //             setIsTyping(prev => !prev);

    //             // display the dialog content with a typewriter effect
    //             setDisplayedDialog(prev => prev + dialogBody.charAt(counter.current));

    //             // if we reach the end of a dialog, we go to the next one
    //             if (counter.current === dialogBody.length+1) {
    //                 dialogSequencing(dialogId);
    //             } else {
    //                 counter.current++;
    //                 setIsTyping(prev => !prev);
    //             }
    //         } else { return; }
    //     }, 50);
    //     return () => clearInterval(intervalId);  
    // }

    // launching the dialog sequence with a small delay 
    // useEffect(() => {
    //     console.log(racesList)
    //     const delay = setTimeout(() => {
    //         typewriterEffect();        
    //     }, 500);
    //     () => clearTimeout(delay);
    // }, []);


    function skipingDialogHandler() {
        if (!isDialogDone) return;

        if (isDialogDone && !dialog[dialogOrder.current].needsInput.displayed) {
            // dialog skip is authorized
            counter.current=-1;
            dialogOrder.current++;
            setDisplayedDialog('');
            setIsDialogDone(false);
        }
    }

    useEffect(() => {
        if(!selectedRace) return;

        console.log(selectedRace)
    }, [selectedRace])


    return(
        <>
            <div 
            id="clickableOverlay"
            className="pointer-events-auto z-index-998"
            onClick={skipingDialogHandler}
            onTouchStart={skipingDialogHandler}>
                <section
                id="characterCreationWrapper"
                className="w-full h-dvh grid grid-rows-3">
                    <div id="sceneWrapper" className="row-span-2 h-full">
                        <span className="fixed right-0 font-minecraft">
                            {isDialogDone && 'Click anywhere to continue'}
                        </span>
                        <Scene 
                        changingVisuals={changingVisuals} 
                        selectedRace={selectedRace} 
                        setSelectedRaceAction={setSelectedRace}
                        />
                    </div>

 
                    <Card
                    bg="black"
                    textColor="white"
                    borderColor="white"
                    shadowColor="white"
                    className="p-4! row-span-1 mb-5! overflow-hidden">
                        <div id='whoIsTalking' className="mb-5 text-lg! sm:text-lg! md:text-2xl! lg:text-3xl! xl:text-2xl! 2xl:text-4xl! ">Narrator:</div>
                        <p
                        id="dialog"
                        className= "text-clip max-h-full text-lg! sm:text-lg! md:text-2xl! lg:text-3xl! xl:text-2xl! 2xl:text-4xl!">
                            {displayedDialog}
                        </p>
                    </Card>
                    
                </section>
            </div>
        </>
    )
}