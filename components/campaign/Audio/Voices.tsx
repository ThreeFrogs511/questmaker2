'use client'
import { useEffect } from "react";
import useSound from "use-sound";
import { useNarrationStore } from "@/stores/useNarrationStore";

export default function Voices({isPressed, play, stop,}: 
    {isPressed:boolean, play:any, stop:any}) {

    const currentNode = useNarrationStore(state => state.currentNode);

    // Playing the voice 
    useEffect(() => {
        // console.log(isPressed)
        // play();
        isPressed ? stop() : play();
        return () => stop();
    }, [currentNode, play, stop, isPressed])
    
    return null;
}