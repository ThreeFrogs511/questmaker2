"use client";
import { Press_Start_2P } from "next/font/google";
import TypeWriter from "typewriter-effect";

const PressStartFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function TypeWriterTitle({ string }: { string: string }) {

  return (
    <h2
      className={`
                        mx-auto text-center
                        text-xl!
                        sm:text-2xl!
                        text-stone-300
                        ${PressStartFont.className}`}
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
