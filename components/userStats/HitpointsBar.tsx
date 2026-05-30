'use client'
import { useState, useEffect} from 'react';
import { ProgressBar } from 'pixel-retroui';
import { useCharacterStore } from '@/stores/useCharacterStore';


export default function HitpointsBar() {

    const character = useCharacterStore(state => state.character);
    const [hpInPercentage, setHpInPercentage] = useState(0);

    useEffect(() => {
            if (!character?.hp) return;
            const percentage = ((character.hp - character.damage_taken) / character.hp) * 100;
            setHpInPercentage(percentage < 0 ? 20 : percentage);

    }, [character, character.hp, character.damage_taken])

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