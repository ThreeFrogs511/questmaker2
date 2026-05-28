"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "pixel-retroui";
import Title from "./Title";
import presets from "../../assets/characterPresets.json";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function RaceSelection({
  indexTitle,
  setIndexTitleAction,
}: {
  indexTitle: number;
  setIndexTitleAction: React.Dispatch<React.SetStateAction<number>>;
}) {
  const races = presets.races;
  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);
  const draft = useCharacterCreationStore((state) => state.draft);
  const [raceDescription, setRaceDescription] = useState<string | undefined>(
    () =>
      draft.race
        ? races.find((c) => c.race === draft.race)?.description
        : "Select a race to view its description.",
  );



  return (
    <>
      <section className={`w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-rows-[10%_50%_30%] gap-5 ${retroGaming.className}`}>
        <Title
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitleAction}
        />

        <div
          id="racesContainer"
          className="row-span-1 grid grid-rows-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-h-full xl:mt-10"
        >
          {races.map((c, index) => (
            <Button
              key={index}
              bg="black"
              textColor={draft.race === c.race ? "yellow" : "white"}
              borderColor={draft.race === c.race ? "yellow" : "white"}
              data-id="race-option"
              onPointerDown={() => {
                updateDraft({ race: c.race });
                setRaceDescription(c.description);
              }}
              className={` px-4 max-h-full py-1! lg:py-5! xl:py-5! 2xl:py-5! 
                        text-center cursor-pointer text-sm! sm:text-base! md:text-lg! lg:text-base! 
                        2xl:text-xl! text-wrap `}
            >
              {c.race}
            </Button>
          ))}
        </div>

        <Card
          bg="black"
          textColor="white"
          borderColor="white"
          shadowColor="white"
          data-id="race-option"
          className="px-4 py-5! row-span-1 text-center
                    text-sm!  overflow-hidden"
        >
          {raceDescription}
        </Card>
      </section>
    </>
  );
}
