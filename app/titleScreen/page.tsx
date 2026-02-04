'use client'
import { Press_Start_2P } from 'next/font/google';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


const PressStartFont = Press_Start_2P({
    subsets: ['latin'],
    weight:'400'
})

export default function TitleScreen() {

    const [hasInteracted, setHasInteracted] = useState(false);
    const [flashEffect, setFlashEffect] = useState(false);
    let timer: ReturnType<typeof setTimeout>;
    const router = useRouter()

    function flashingEffect() {
        new Promise<void>(resolve => {
            timer = setTimeout(() => {
                        setFlashEffect(true);

                        resolve();
            }, 1000);
        })
        .then(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                    setFlashEffect(false);

                    flashingEffect();
            }, 1000);
        })
    }

    useEffect(() => {
        if (flashEffect) return;
        flashingEffect()
        return () => clearTimeout(timer);  

    },[])

    useEffect(() => {
        if (!hasInteracted) return;
        router.push('/login');

    },[hasInteracted])




    return(
        <>
        <section 
        id="titleScreenWrapper"
        className="cursor-pointer h-dvh  grid grid-rows-[60%_40%] gap-5 overflow-hidden"
        onPointerDown={() => setHasInteracted(true)}>
            <div className="flex flex-col justify-center">
            <h1 className={`${PressStartFont.className} text-2xl! sm:text-4xl! text-center text-stone-300 tracking-widest!`}>QUESTMAKER</h1>
            </div>
            <div 
            className={!flashEffect ? `text-black` : `text-white`}>
                <p className="font-minecraft text-center text-base">Click or Touch the screen to start</p>
            </div>
        </section>
        </>
    )
}