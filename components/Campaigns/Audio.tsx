'use client'
import { useEffect } from "react";
import useSound from "use-sound";
import { Nodes } from "./NodeTypes";

export default function Audio({isPressed, setIsPressedAction, currentNode, currentCampaign}: {
    isPressed:boolean,
    setIsPressedAction:React.Dispatch<React.SetStateAction<boolean>>,
    currentNode:keyof Nodes | undefined,
    currentCampaign:Nodes
}) {

    // the voice over
    const [play, {stop}] = useSound(`/voices/${currentNode ?? Object.keys(currentCampaign)[0]}.mp3`, {
        interrupt:true
    })

    // Playing the voice 
    useEffect(() => {
        play();
        !isPressed ? stop() : play();
        return () => stop();
    }, [play, stop, isPressed])
    
    return null;
}