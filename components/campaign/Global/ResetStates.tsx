"use client";
import {useNarrationStore} from "@/stores/useNarrationStore";
import {useCombatStore} from "@/stores/useCombatStore";
import {useEffect} from "react";
import { Howl, Howler } from "howler";


export default function ResetStates() {
    const resetAllNarr = useNarrationStore((state) => state.resetAll);
    const resetAllCombat = useCombatStore((state) => state.resetAll);

    useEffect(() => {
        resetAllNarr();
        resetAllCombat();
    }, []);

    return null;
}