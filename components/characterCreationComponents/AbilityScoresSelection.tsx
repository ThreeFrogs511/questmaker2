
'use client'
import { Card } from "pixel-retroui"
import Title from './Title'
import { Attributes } from "@/types/types"
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore"


export default function AbilityScoresSelection({ indexTitle, setIndexTitleAction} : {
    indexTitle:number,
    setIndexTitleAction:React.Dispatch<React.SetStateAction<number>>,
}) {

    const abilitiesName = ['Strength', 'Dexterity', 'Constitution',  'Wisdom', 'Intelligence','Charisma'];
    const abilityScores = useCharacterCreationStore(state => state.abilityScores);
    const addPoint = useCharacterCreationStore(state => state.addPoint);
    const removePoint = useCharacterCreationStore(state => state.removePoint);
    const pointsToSpare = useCharacterCreationStore(state => state.pointsToSpare);
    const setPointsToSpare = useCharacterCreationStore(state => state.setPointsToSpare);
    
  

    function usingAbilityPoints(e:React.PointerEvent<HTMLSpanElement>) {
        type targetAbility = keyof Attributes;
        const targetAbility:targetAbility = e.currentTarget.id as keyof Attributes;
        console.log(targetAbility)
        if (e.currentTarget.dataset.id === "minus") {
            console.log(targetAbility)
            // we reduce the target ability score, but we stop at 7
            if (abilityScores[targetAbility] > 7) {
                removePoint(targetAbility);
                setPointsToSpare(1);
            } else {
                return;
            };

        } else {
            if (pointsToSpare===0) return;

            // we increase the selected ability score, but we stop at 17
            if (abilityScores[targetAbility] < 17) {
                addPoint(targetAbility);
                setPointsToSpare(-1);
            } else {
                return;
            };
        }
    };




    return(
        <>
        <section id="abilityScoresSelectionContainer" 
        className="w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 
        grid grid-rows-[10%_50%_30%]  gap-5">
            <Title indexTitle={indexTitle} setIndexTitleAction={setIndexTitleAction} />
            
            <Card
            bg="black"
            textColor="white"
            borderColor="white"
            shadowColor="white"
            className="p-4 text-center h-full flex flex-col justify-around row-span-2">
                <h3 className="text-sm! sm:text-base! lg:text-xl! xl:text-xl! 2xl:text-xl!">You have <span className="text-yellow-400">{pointsToSpare}</span> ability points</h3>
                {Object.entries(abilityScores).map(([key, value], index) => (
                    <div 
                    key={key}
                    className="grid grid-cols-6 text-sm! sm:text-base! lg:text-xl! xl:text-xl! 2xl:text-xl!">
                        <span 
                        className="col-span-1 cursor-pointer hover:text-yellow-400 active:text-yellow-400" 
                        id={key} 
                        data-id="minus" 
                        onPointerDown={(e) => usingAbilityPoints(e)}>
                            -
                        </span>
                        <span className="col-span-3 cursor-pointer">{abilitiesName[index]}</span> 
                        <span className={`col-span-1 cursor-pointer ${value<10 ? "text-red-600" : "text-yellow-400"}`}>{value}</span>
                        <span className="col-span-1 cursor-pointer hover:text-yellow-400 active:text-yellow-400" 
                        id={key} 
                        data-id="plus" 
                        onPointerDown={(e) => usingAbilityPoints(e)}>
                            +
                        </span>
                    </div>
                ))}
            </Card>
        </section>
        </>
    )
}