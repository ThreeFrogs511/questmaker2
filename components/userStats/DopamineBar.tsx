'use client'

import { ProgressBar } from 'pixel-retroui';
import { useEffect, useState} from 'react';
import { useCharacterStore } from '@/stores/useCharacterStore';

export default function DopamineBar() {

    const character = useCharacterStore(state => state.character);
    const [dopamineInPercentage, setDopamineInPercentage] = useState(0);

    useEffect(() => {
        if (character?.dopamine) {
            const percentage = ((character.dopamine - character.dopamine_consumed) / character.dopamine) * 100;
            setDopamineInPercentage(percentage < 0 ? 20 : percentage);
        }
    }, [character, character.hp, character.damage_taken]);
    
    return(
        <>
        <div className='dopamineContainer'>
            <ProgressBar
                size="sm"
                color="blue"
                borderColor="white"
                className="w-full"
                progress={dopamineInPercentage}
            />
        </div>
        </>
    )
}