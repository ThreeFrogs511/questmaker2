'use client'

import { ProgressBar } from 'pixel-retroui';
import { useEffect, useState} from 'react';
import { useUserStore } from '@/stores/useUserStore';

export default function Bar() {

    const currentUser = useUserStore(state => state.currentUser);
    const [dopamineInPercentage, setDopamineInPercentage] = useState(0);

    useEffect(() => {
        if (currentUser && currentUser.dopamine) {
            const percentage = ((currentUser.dopamine-currentUser.dopamine_consumed)/currentUser.dopamine)*100;
            setDopamineInPercentage(percentage<0 ? 20 : percentage);
        } 
    }, [currentUser, currentUser.hp, currentUser.damage_taken]);
    
    return(
        <>
        <div className='dopamineContainer'>
            <ProgressBar
                size="md"
                color="blue"
                borderColor="white"
                className="w-full"
                progress={dopamineInPercentage}
            />
        </div>
        </>
    )
}