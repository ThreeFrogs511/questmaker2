'use client'
import { Button } from "pixel-retroui"

export default function titleScreen() {
    return(
        <>
        <section 
        id="titleScreenWrapper"
        className="h-dvh grid grid-rows-[70%_auto] gap-5">
            <figure className="md:flex md:justify-center md:pt-0 pt-10 
            grid! grid-rows-auto items-center">
                <img src="./pictures/title_screen.png" alt="title screen" className="grow-0! max-h-full h-auto row-span-2" />
            </figure>
            <div 
            id="titleScreenMenu"
            className="flex flex-col items-center gap-3 
            w-full sm:w-[70%]! lg:w-[50%]! xl:w-[50%]! 2xl:w-[50%]!  mx-auto
            text-2xl! lg:text-3xl! xl:text-4xl! 2xl:text-4xl!">
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className="w-[80%] p-1! lg:p-5! xl:p-5! 2xl:p-5!">
                Start
                </Button>
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className="w-[80%] p-1! lg:p-5! xl:p-5! 2xl:p-5!">
                Continue game
                </Button>

            </div>

        </section>
        </>
    )
}