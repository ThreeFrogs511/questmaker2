"use client";
import TypeWriter from "typewriter-effect";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useRef, useState } from "react";
import AudioManager from "@/classes/AudioManager";
import { useRouter } from "next/navigation";

export default function IntroPage() {
    const character = useCharacterStore.getState().character;
    const [overlayOn, setOverlay] = useState(false);
    const introTxt = [
    `<p style='margin-bottom:.5rem'">Hello, <span style=\"color:#fbbf24\">${character.username}</span>. Welcome to the Globe.</p>`,
    "A world full of wonders, perils and possibilities.<br>",
    "What kind of destiny will you forge for yourself ? <br>",
    "What kind of world your choices will shape ? <br>",
    "It will fall upon you to decide. <br>",
    "<p style='margin-bottom:2rem'>But first, let's begin your story.</p>",
    "Yours commence on a beach..."
    ];
    const router = useRouter();
    const hasActivated = useRef(false);

 

  return (
    <>
    <div id="overlay" className={`fixed h-full w-full z-999 ${!overlayOn ? 'bg-transparent' : 'bg-black'}`}></div>
    <section className="h-full w-[80%] mx-auto text-center text-3xl flex items-center justify-center">
        <TypeWriter
        options={{
            autoStart: true,
            delay: 100,
        }}
        onInit={(typewriter) => {
            typewriter.typeString(introTxt[0]).start()
            .pauseFor(2500)
            .typeString(introTxt[1])
            .pauseFor(2500)
            .typeString(introTxt[2])
            .pauseFor(2500)
            .typeString(introTxt[3])
            .pauseFor(2500)
            .typeString(introTxt[4])
            .pauseFor(2500)
            .typeString(introTxt[5])
            .pauseFor(2500)
            .typeString(introTxt[6])
            .pauseFor(3000)
            .callFunction(() => {
                if (hasActivated.current) return;
                hasActivated.current = true;
                setOverlay(true);
                const audio = new AudioManager();   
                audio.playSfx("thumpSound");
                setTimeout(() => {
                    audio.resetAllAudio();
                    router.push('campaignRunning/a_terrible_hangover')
                }, 4000);
            });
        }}
        />    
      </section>
      </>
  );
}
