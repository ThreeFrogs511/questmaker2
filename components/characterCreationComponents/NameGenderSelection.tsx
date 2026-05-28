'use client'

import Title from './Title'
import { useUserContext } from '@/context/context'
import { useCharacterCreationStore } from '@/stores/useCharacterCreationStore'
import { useUserStore } from '@/stores/useUserStore'
import { Input, Button } from "pixel-retroui"
import { useEffect } from 'react'
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function nameGenderSelection({indexTitle, setIndexTitleAction }: {
    indexTitle:number,
    setIndexTitleAction:React.Dispatch<React.SetStateAction<number>>
}) {

    // const {currentUser, setCurrentUser} = useUserContext();
    const updateDraft = useCharacterCreationStore(state => state.updateDraft);
    const draft = useCharacterCreationStore(state => state.draft);
    const gendersList = ['Male', 'Female'];



    return(
        <>
        <section
            className={`w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-rows-[10%_auto] ${retroGaming.className}`}>
            <Title indexTitle={indexTitle} setIndexTitleAction={setIndexTitleAction} />
            
            <div 
            className="
           
            flex
            flex-col
            gap-20
            min-h-80
            justify-center
            items-center!
            w-full
            lg-w-[50%]
            xl:w-[50%]
            2xl:w-[50%]
            mx-auto">
                <div className="w-full">
                    <Input
                        bg="black"
                        textColor="white"
                        borderColor="white"
                        id="username"
                        type="text"
                        className="w-full focus:outline-none p-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
                        placeholder="Your hero's name..."
                        value={draft.username ?? ''}
                        onChange={(e) => {
                            updateDraft({username:e.target.value})}
                        }
                        ></Input>
                </div>
                <div className="w-full mx-auto flex flex-col items-center! gap-5">
                    {gendersList.map((item, index) => (
                        <Button
                        key={index}
                        bg="black"
                        textColor={draft.gender === item ? "yellow" : "white"}
                        borderColor={draft.gender === item ? "yellow" : "white"}
                        className={`px-4 max-h-full w-full py-5! lg:py-5! xl:py-5! 2xl:py-5! 
                        text-center cursor-pointer text-sm sm:text-base md:text-lg! lg:text-xl! 
                        xl:text-xl! 2xl:text-2xl! text-wrap `}
                        onPointerDown={() => {
                            updateDraft({gender:item})}}
                            >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}