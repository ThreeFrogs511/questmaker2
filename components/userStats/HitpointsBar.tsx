'use client'
import { useState, useEffect} from 'react';
import { ProgressBar } from 'pixel-retroui';
import { useUserStore } from '@/stores/useUserStore';
import { useNarrationStore } from '@/stores/useNarrationStore';

export default function Bar() {

    const currentUser = useUserStore(state => state.currentUser);
    const [hpInPercentage, setHpInPercentage] = useState(0);

    useEffect(() => {
        if (currentUser && currentUser.hp) {
            const percentage = ((currentUser.hp-currentUser.damage_taken)/currentUser.hp)*100;
            setHpInPercentage(percentage<0 ? 0 : percentage);
        }
    }, [currentUser.damage_taken])

    return(
        <>
         <ProgressBar
            size="md"
            color="red"
            borderColor="white"
            className="w-full"
            progress={hpInPercentage}
            />
        </>
    )
}