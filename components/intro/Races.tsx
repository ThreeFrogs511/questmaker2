'use client'
import { useEffect, useState } from "react"

export default function Races({selectedRace, setSelectedRaceAction} :{
    selectedRace: string | null,
    setSelectedRaceAction : React.Dispatch<React.SetStateAction<string | null>>
}) {




    return(
        <>
            <div className="h-full">
                <h2 className="text-2xl font-minecraft text-center my-10!">Choose your race</h2>
                <div className="grid grid-cols-3 grid-rows-auto aspect-square gap-2 w-full mx-auto">
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Elf')} onTouchStart={() => setSelectedRaceAction('Elf')}>Elf</span>
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Half-elf')} onTouchStart={() => setSelectedRaceAction('Half-elf')}>Half-Elf</span>
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Human')} onTouchStart={() => setSelectedRaceAction('Human')}>Human</span>
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Dwarf')} onTouchStart={() => setSelectedRaceAction('Dwarf')}>Dwarf</span>
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Orc')} onTouchStart={() => setSelectedRaceAction('Orc')}>Orc</span>
                    <span className="cols-span-1 row-span-1 border" onClick={() => setSelectedRaceAction('Felinois')} onTouchStart={() => setSelectedRaceAction('Felinois')}>Feline</span>
                </div>
                <h3 id="raceTitle" className="font-minecraft mt-15! text-center text-4xl!">{selectedRace}</h3>
            </div>
        </>
    )
}