'use client'
import { useState, useEffect} from 'react';
import { ProgressBar } from 'pixel-retroui';
import { useUserStore } from '@/stores/useUserStore';


export default function HitpointsBar() {

    const currentUser = useUserStore(state => state.currentUser);
    const [hpInPercentage, setHpInPercentage] = useState(0);

    useEffect(() => {
            if (!currentUser || !currentUser.hp) return;
            const percentage = ((currentUser.hp-currentUser.damage_taken)/currentUser.hp)*100;
            setHpInPercentage(percentage<0 ? 20 : percentage);
        
    }, [currentUser, currentUser.hp, currentUser.damage_taken])

    return(
        <>
        <div className='hpContainer'>
            <ProgressBar
            size="sm"
            color="red"
            borderColor="white"
            className="w-full"
            progress={hpInPercentage}
            />
        </div>
        </>
    )
}