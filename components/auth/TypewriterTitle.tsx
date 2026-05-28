"use client";
import TypeWriter from "typewriter-effect";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function TypeWriterTitle({ string }: { string: string }) {

  return (
    <h2
      className={`mx-auto text-center text-xl! sm:text-2xl! text-stone-300 ${retroGaming.className}`}
    >
      <TypeWriter
        options={{
          autoStart: true,
          delay:70
        }}
        onInit={(typewriter) => {
          typewriter.typeString(string).start();
        }}
      />
    </h2>
  );
}
