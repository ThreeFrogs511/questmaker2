'use client'
import { useEffect } from "react";


export default function Music({play, stop}: {play: () => void, stop: () => void}) {

    // Playing the voice 
    useEffect(() => {
        play();
        return () => stop();
    }, [play, stop])
    
    return null;
}