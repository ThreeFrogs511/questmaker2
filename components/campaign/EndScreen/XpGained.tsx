
'use client'
import { useEffect, useRef} from 'react'
import XpBar from '../../userStats/XpBar'
import { useUserStore } from '@/stores/useUserStore'

export default function XpGained(
    {setIsSkippingAllowedAction, hasXpBeenUpdated, setHasXpBeenUpdatedAction, gameplay} : 
    {
        setIsSkippingAllowedAction:React.Dispatch<React.SetStateAction<boolean>>,
        hasXpBeenUpdated:boolean,
        setHasXpBeenUpdatedAction: React.Dispatch<React.SetStateAction<boolean>>,
        gameplay:any

    }) {

    const addXp = useUserStore(state => state.addXp)
    const currentUser = useUserStore(state => state.currentUser)
    const accXp = gameplay.getAccumulatedXp();

    // the ref below prevents the double mount in dev, while hasXpBeenUpdated prevents
    //the useEffect to replay again after a re-render
    const stopDoubleRef = useRef(false);

    useEffect(() => {
        if (hasXpBeenUpdated === true) return;
        if (stopDoubleRef.current === true) return;
        stopDoubleRef.current = true;
        setHasXpBeenUpdatedAction(true);
        
   
        setIsSkippingAllowedAction(false);
        new Promise<void>(resolve => {setTimeout(() => {resolve();}, 200)})
            .then(()  => addXp(accXp))
            .then(() => setIsSkippingAllowedAction(true))
            .then(() => console.log("valeur de accXp = " + accXp))
    }, [accXp, hasXpBeenUpdated, currentUser])


    return(
        <>
            <div className="w-[90%] mx-auto h-[20%] max-h-[20%] flex flex-col justify-center">
                <h1 className="text-xl! lg:text-4xl! mt-5! font-bold text-center font-minecraft text-amber-400">
                    Experience points gained this campaign
                </h1>
            </div>
            <div className='text-center text-xl'>
                You gain xp by living your adventure, falling enemies and succeeding ability checks.
            </div>
            <div className="h-[50%] w-[90%] lg:w-[70%] mx-auto max-h-full flex flex-col justify-center">
                <h2 className='text-xl! mb-3!'>You gained <span className='text-green-500'>{accXp}</span> xp!</h2>
                <XpBar />
            </div>
        </>
    )
}