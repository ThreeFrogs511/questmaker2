
'use client'
import { useUserContext } from "@/context/context"
import { Card, Button } from "pixel-retroui"
import Title from './Title'
import presets from '../../assets/characterPresets.json'


    type Abilities = {
        Strength:number,
        Dexterity:number,
        Constitution: number,
        Intelligence: number,
        Wisdom: number,
        Charisma: number,
    }

export default function AbilityScoresSelection({abilityScores, setAbilityScoresAction, indexTitle, setIndexTitleAction, pointsToSpare, setPointsToSpareAction} : {
    abilityScores: Abilities,
    setAbilityScoresAction:React.Dispatch<React.SetStateAction<Abilities>>,
    indexTitle:number,
    setIndexTitleAction:React.Dispatch<React.SetStateAction<number>>,
    pointsToSpare:number,
    setPointsToSpareAction: React.Dispatch<React.SetStateAction<number>>
}) {

    const {currentUser} = useUserContext();


    function usingAbilityPoints(e:any) {
        type targetAbility = keyof Abilities;

        if (e.target.dataset.id === "minus") {
            const targetAbility:targetAbility = e.target.id;
            // const abilityFormatted = targetAbility.charAt(0) + targetAbility.charAt(1) + targetAbility.charAt(2);

            // we reduce the target ability score, but we stop at 7
            if (abilityScores[targetAbility] > 7) {
                setAbilityScoresAction(prev => ({
                    ...prev, 
                    [targetAbility]: prev[targetAbility] - 1
                }));

                setPointsToSpareAction(prev => prev + 1);
            } else {
                return;
            }

        } else {
            if (pointsToSpare===0) return;
            const targetAbility:targetAbility = e.target.id;

            // we increase the selected ability score, but we stop at 17
            if (abilityScores[targetAbility] < 17) {
                setAbilityScoresAction(prev => ({
                    ...prev, 
                    [targetAbility]: prev[targetAbility] + 1
                }));
                setPointsToSpareAction(prev => prev - 1);
            } else {
                return;
            }
        }
    }


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
                {Object.entries(abilityScores).map(([key, value]) => (
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
                        <span className="col-span-3 cursor-pointer">{key}</span> 
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