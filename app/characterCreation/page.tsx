'use client'
import NameGenderSelection from "@/components/characterCreationComponents/NameGenderSelection"
import RaceSelection from "@/components/characterCreationComponents/RaceSelection"
import ClassSelection from "@/components/characterCreationComponents/ClassSelection"
import AbilityScoresSelection from "@/components/characterCreationComponents/AbilityScoresSelection"
import SummaryCreation from "@/components/characterCreationComponents/SummaryCreation"
import { useCharacterCreationStore } from '@/stores/useCharacterCreationStore'



import { useUserContext } from "@/context/context"
import { useEffect, useState } from "react"

export default function characterCreation() {


    const draft = useCharacterCreationStore(state => state.draft);

    useEffect(() => {
        console.log(draft)
    }, [draft])
    
    // determines which title and page to display
    const [indexTitle, setIndexTitle] = useState(0);

    // handles the user's choices
    const [abilityScores, setAbilityScores] = useState(
        {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
        })
    const [pointsToSpare, setPointsToSpare] = useState(5);
   
    return(
        <>

            {indexTitle===0 &&<NameGenderSelection 
            indexTitle={indexTitle}
            setIndexTitleAction={setIndexTitle}
            />}

            {indexTitle===1 && <RaceSelection 
            indexTitle={indexTitle} 
            setIndexTitleAction={setIndexTitle}/>}

            {indexTitle===2 && <ClassSelection 
            indexTitle={indexTitle} 
            setIndexTitleAction={setIndexTitle} 
            setAbilityScoresAction={setAbilityScores}/>}

            {indexTitle===3 && <AbilityScoresSelection 
            abilityScores={abilityScores} 
            setAbilityScoresAction={setAbilityScores} 
            indexTitle={indexTitle} 
            setIndexTitleAction={setIndexTitle}
            pointsToSpare={pointsToSpare}
            setPointsToSpareAction={setPointsToSpare} />}

            {indexTitle===4 &&  <SummaryCreation 
            abilityScores={abilityScores} indexTitle={indexTitle} 
            setIndexTitleAction={setIndexTitle}/>}



        </>
    )
}