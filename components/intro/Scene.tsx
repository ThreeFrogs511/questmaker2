
'use client'
import Wizard from "./Wizard"
import Races from "./Races"

export default function Scene({changingVisuals, selectedRace, setSelectedRaceAction} : {
    changingVisuals: number | null,
    selectedRace: string | null,
    setSelectedRaceAction : React.Dispatch<React.SetStateAction<string | null>>}
) {


    return(
        <>
        {changingVisuals === 2 ? <Races selectedRace={selectedRace} setSelectedRaceAction={setSelectedRaceAction}/> : <Wizard />}
        </>
    )
}