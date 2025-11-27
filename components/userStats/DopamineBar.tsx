'use client'
import { useState, useEffect } from 'react';
import { ProgressBar } from 'pixel-retroui';
import { useUserContext } from '@/context/context';

export default function Bar() {

    const {currentUser, isFetchingDone} = useUserContext();

    const maxDopamine= currentUser.dopamine;
    const [currentDopamine, setCurrentDopamine] = useState<number>(100);

        
        function calculatingDopamine() {
            if (currentUser.dopamine && currentUser.dopamine_consumed) {
                const percentageOfDopamineLost = Math.floor((currentUser.dopamine_consumed / currentUser.dopamine)*100);
                setCurrentDopamine(100-percentageOfDopamineLost);
            };
        }

        useEffect(() => {
            if (currentUser && isFetchingDone) {
                calculatingDopamine();
            }
        }, [isFetchingDone])

    return(
        <>
            <ProgressBar
                size="md"
                color="blue"
                borderColor="white"
                className="w-full"
                progress={currentDopamine}
            />
        </>
    )
}