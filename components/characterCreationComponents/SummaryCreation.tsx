'use client'
import { Card, Button} from "pixel-retroui"
import Title from './Title'
import { useUserContext } from "@/context/context"
import User from '@/classes/User'
import { useRouter } from "next/navigation"
import presets from '../../assets/characterPresets.json'

type Abilities = {
    Strength:number,
    Dexterity:number,
    Constitution: number,
    Intelligence: number,
    Wisdom: number,
    Charisma: number,
}


export default function SummaryCreation(
{ abilityScores, indexTitle, setIndexTitleAction} : 
{
    abilityScores: Abilities,
    indexTitle:number,
    setIndexTitleAction:React.Dispatch<React.SetStateAction<number>>
})
{
    const router = useRouter();
    const {currentUser, setCurrentUser} = useUserContext();
    const classes = presets.classes;

    // this function create a User class then sends the data to the
    // PATCH API that update and complete the user profile
    async function handleCharacterCreation() {
        if (
        currentUser.race && 
        currentUser.user_class && 
        currentUser.username && 
        currentUser.email && 
        currentUser.id && 
        currentUser.gender
        ) {
            const newCharacter = new User(
                currentUser.username, 
                currentUser.gender, 
                currentUser.race, 
                currentUser.user_class, 
                abilityScores.Strength, 
                abilityScores.Dexterity, 
                abilityScores.Constitution, 
                abilityScores.Intelligence,
                abilityScores.Wisdom, 
                abilityScores.Charisma
            );

            // calculating hitpoints and dopamine values
            const hp:number = newCharacter.calculateHitpoints();
            const dopamine:number = newCharacter.calculateDopamine(classes, currentUser, abilityScores) ?? 0;

            // updating and finishing the profile
            const feedback = await newCharacter.completeProfile(currentUser.id, hp, dopamine);
            if (feedback.success) {
                // storing the last bit of data into the global state
                setCurrentUser(prev => ({...prev, 
                    str:abilityScores.Strength,
                    dex: abilityScores.Dexterity,
                    con: abilityScores.Constitution,
                    int: abilityScores.Intelligence,
                    wis: abilityScores.Wisdom,
                    cha: abilityScores.Charisma,
                    hp:hp,
                    dopamine: dopamine,
                    lvl:1,
                    profile_completed:true,
                    damage_taken:0,
                    dopamine_consumed:0
                    }));
                router.push("/journal");
            } else {
                console.log(feedback.error);
            }
        }
    }

    return(
        <>
        <section id="summaryCharacterCreation" className="w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 
        grid grid-rows-[10%_auto]">
 
            <Title indexTitle={indexTitle} setIndexTitleAction={setIndexTitleAction} />
            <div id="userDataSummaryContainer" className="h-full flex flex-col gap-3">
                <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="p-4 text-center text-sm! sm:text-base! lg:text-xl! xl:mt-5!">
                    <p className={currentUser.username ?? "text-red-600"}>
                        {currentUser.username ? "Name : " + currentUser.username : 'Choose a name'}
                    </p>
                    <p className={currentUser.gender ?? "text-red-600"}>
                        {currentUser.gender ? "Gender : " + currentUser.gender : 'Choose a gender'}
                    </p>
                    <p className={currentUser.race ?? "text-red-600"}>
                        {currentUser.race ? "Race : " + currentUser.race : 'Choose a race'}
                    </p>
                    <p className={currentUser.user_class ?? "text-red-600"}>
                        {currentUser.user_class ? "Class : " + currentUser.user_class : 'Choose a class'}
                    </p>
                </Card>
                <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="p-4 text-center flex flex-col justify-evenly h-[60%]! xl:h-[50%]! text-sm! sm:text-base! lg:text-xl! xl:text-xl! 2xl:text-xl!">
                    {Object.entries(abilityScores).map(([key, value]) => (
                        <div 
                        key={key}
                        className="grid grid-cols-3 grid-rows-0 w-full! xl:w-[80%]! 2xl:w-[80%]! mx-auto ">
                            <span className="col-span-1 text-start">{key}</span> 
                            <span className={`col-span-2 text-end ${value<10 ? "text-red-600" : "text-yellow-400"}`}>{value}</span>
                        </div>
                    ))}
                </Card>
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className="grow lg:text-2xl!"
                onPointerDown={handleCharacterCreation}>
                    Confirm my character
                </Button>
            </div>
        </section>
        </>
    )
}