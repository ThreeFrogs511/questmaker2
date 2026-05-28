'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

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
        className={`cursor-pointer h-dvh  grid grid-rows-[60%_40%] gap-5 overflow-hidden ${retroGaming.className}`}
        onPointerDown={() => setHasInteracted(true)}>
            <div className="flex flex-col justify-center">
            <h1 className="text-2xl! sm:text-4xl! text-center text-stone-300 tracking-widest!">QUESTMAKER</h1>
            </div>
            <div 
            className={!flashEffect ? `text-black` : `text-white`}>
                <p className="text-center text-base">Click or Touch the screen to start</p>
            </div>
        </section>
        </>
    )
}