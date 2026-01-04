'use client'

import { useUserStore } from "@/stores/useUserStore";
import playerAttackTests from '@/assets/playerAttacksTest.json';
import { useEffect } from "react";

export default function PreloadAttackIcons() {

    const attacks = useUserStore(state => state.attacks);
    const fetchSelectedAttacks = useUserStore(state => state.fetchSelectedAttacks);

    useEffect(() => {
        if (!playerAttackTests) return;
        const listOfAttacks = {...playerAttackTests[0]};
        fetchSelectedAttacks(listOfAttacks)

    }, [playerAttackTests])

    return(
        
    <>


    </>
    )
}