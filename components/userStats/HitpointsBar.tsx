import { ProgressBar } from 'pixel-retroui';
import { useUserContext } from '@/context/context';
import { useEffect, useState } from 'react';

export default function Bar() {

    const {currentUser, isFetchingDone} = useUserContext();
    const maxHp = currentUser.hp;
    const [currentHp, setCurrentHp] = useState<number>(100);

    useEffect(() => {
        if (isFetchingDone) {
            console.log(currentUser)
        }
    }, [isFetchingDone])
    
    function calculatingHitpoints() {
        if (currentUser.hp && currentUser.damage_taken>0) {
            const percentageOfLifeLost = Math.floor((currentUser.damage_taken / currentUser.hp)*100);
            setCurrentHp(100 - percentageOfLifeLost);
        } else {
            setCurrentHp(100);
        }
    }

    useEffect(() => {
        if (currentUser) {
            calculatingHitpoints();
        }
    }, [currentUser.damage_taken])

    return(
        <>
         <ProgressBar
            size="md"
            color="red"
            borderColor="white"
            className="w-full"
            progress={currentUser.hp ? currentHp : 100}
            />
        </>
    )
}