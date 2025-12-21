'use client'
import { Card } from 'pixel-retroui'
import { useUserContext } from '@/context/context'
import Hitpoints from '@/components/userStats/HitpointsBar'
import DopamineBar from '@/components/userStats/DopamineBar'
import Progress from '@/components/userStats/ProgressBar'
import Footer from "@/components/global/Footer"
import Header from "@/components/global/Header"

import { useUserStore } from '@/stores/useUserStore'

export default function Profile() {

    const currentUser = useUserStore(state => state.currentUser);

    return (
        <>
        <Header/>

        <section
            id="profile"
            className="
                w-full
                sm:w-4/5!
                md:w-3/4!
                mx-auto
                grid
                grid-cols-1
                xl:grid-cols-2
                2xl:grid-cols-2
                gap-8">

            <div className= 'flex flex-col'>
                {/* main stats */}
                <Card
                    bg="black"
                    textColor="white"
                    borderColor="white"
                    shadowColor="white"
                    className="text-center mb-10! lg:mb-4!"
                >
                    <div className="p-2 grid grid-cols-4">
                        <figure className="col-span-2 flex justify-center">
                            <img
                                src="./portrait_male.webp"
                                alt="portrait"
                                className="h-auto w-[90%]"
                            />
                        </figure>

                        <ul className="ml-5! col-span-2 flex flex-col justify-evenly items-start">
                            <li className='text-lg! md:text-2xl!'>{currentUser?.username}</li>
                            <li className='text-lg!  md:text-2xl!'>Level {currentUser?.lvl}</li>
                            <li className='text-lg!  md:text-2xl!'>{currentUser?.user_class}</li>
                        </ul>
                    </div>
                </Card>

                {/* hp, mana/stamina, xp */}
                <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="p-6! text-center grow">
                    <div className="mb-5! mt-2!">
                        <span className='text-lg! sm:text-lg! md:text-xl! lg:text-2xl!'>Hp</span>
                        <div className='w-[95%] mx-auto my-3'><Hitpoints /></div>
                    </div>

                    <div className="mb-5!">
                        <span className='text-lg! sm:text-lg! md:text-xl! lg:text-2xl!'>Dopamine</span>
                        <div className='w-[95%] mx-auto my-3'><DopamineBar /></div>
                    </div>

                    <div className="mb-5!">
                        <span className='text-lg! sm:text-lg! md:text-xl! lg:text-2xl!'>Xp</span>
                    <div className='w-[95%] mx-auto my-3'><Progress /></div> 
                    </div>
                </Card>
            </div>

            {/* points and attributes */}
            <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="text-center"
            >
                <p className="mb-6! text-lg! sm:text-lg! md:text-2xl! pt-5 ">User stats</p> 

                <ul className='flex flex-col justify-evenly h-[80%] max-h-full'>
                    <li className=" w-[80%] mx-auto py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Strength</span> 
                        <span className='text-yellow-400'>{currentUser?.str ?? 10}</span>
                    </li>
                    <li className=" w-[80%] mx-auto py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Dexterity</span> 
                        <span className='text-yellow-400'>{currentUser?.dex ?? 10}</span>
                    </li>
                    <li className=" w-[80%] mx-auto py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Constitution</span> 
                        <span className='text-yellow-400'>{currentUser?.con ?? 10}</span>
                    </li>
                    <li className=" w-[80%] mx-auto py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Intelligence</span> 
                        <span className='text-yellow-400'>{currentUser?.int ?? 10}</span>
                    </li>
                    <li className=" w-[80%] mx-auto py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Wisdom</span> 
                        <span className='text-yellow-400'>{currentUser?.wis ?? 10}</span>
                    </li>
                    <li className=" w-[80%] mx-auto mb-5 py-2 flex justify-between text-lg! sm:text-lg! md:text-2xl!">
                        <span>Charisma</span> 
                        <span className='text-yellow-400'>{currentUser?.cha ?? 10}</span>
                    </li>
                </ul>
            </Card>

        </section>
        <Footer />
        </>
    )
}

