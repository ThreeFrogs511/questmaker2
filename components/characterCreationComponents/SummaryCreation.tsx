"use client";
import { Card, Button } from "pixel-retroui";
import Title from "./Title";
import Character from "@/classes/Character";
import { useRouter } from "next/navigation";
import presets from "../../assets/characterPresets.json";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useEffect } from "react";
import { User, Draft } from "@/types/types";
import localFont from "next/font/local";

type feedback = {
  success?: boolean;
  err?: string;
};

const retroGaming = localFont({ src: "../../public/fonts/retro_gaming.ttf" });

export default function SummaryCreation({
  indexTitle,
  setIndexTitleAction,
}: {
  indexTitle: number;
  setIndexTitleAction: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();

  const abilitiesName = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  // import the login function from dedicated zustand store
  const login = useUserStore((state) => state.login);
  const draft = useCharacterStore((state) => state.draft);
  const hydrateCharacter = useCharacterStore((state) => state.hydrateCharacter);
  const updateDraft = useCharacterStore((state) => state.updateDraft);
  const abilityScores = useCharacterStore((state) => state.abilityScores);
  const classes = presets.classes;

  async function handleCharacterCreation2() {
    if (draft.race && draft.user_class && draft.username && draft.gender) {
      const player = new Character({ ...draft });

      const feedback: feedback = await player.completeProfile(draft, classes);
      if (feedback.success) {
        const newCharacter = player.buildCharacterFromDraft(draft);
        hydrateCharacter(newCharacter);
        router.push("/intro");
      } else if (feedback.err) {
        // console.log("error while creating your character");
      }
    }
  }

  // updating stats in real time
  // we do it in this component to avoid infinite loop
  // in the abilityScoresSelection component
  useEffect(() => {
    updateDraft({ ...abilityScores });
  }, [abilityScores, updateDraft]);

  return (
    <>
      <section
        id="summaryCharacterCreation"
        className={`w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-rows-[10%_auto] ${retroGaming.className}`}
      >
        <Title
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitleAction}
        />
        <div
          id="userDataSummaryContainer"
          className="h-full flex flex-col gap-3"
        >
          <Card
            bg="black"
            textColor="white"
            borderColor="white"
            shadowColor="white"
            className="p-4 text-center text-sm! sm:text-base! lg:text-xl! xl:mt-5!"
          >
            <p className={draft.username ?? "text-red-600"}>
              {draft.username ? "Name : " + draft.username : "Choose a name"}
            </p>
            <p className={draft.gender ?? "text-red-600"}>
              {draft.gender ? "Gender : " + draft.gender : "Choose a gender"}
            </p>
            <p className={draft.race ?? "text-red-600"}>
              {draft.race ? "Race : " + draft.race : "Choose a race"}
            </p>
            <p className={draft.user_class ?? "text-red-600"}>
              {draft.user_class
                ? "Class : " + draft.user_class
                : "Choose a class"}
            </p>
          </Card>
          <Card
            bg="black"
            textColor="white"
            borderColor="white"
            shadowColor="white"
            className="p-4 text-center flex flex-col justify-evenly h-[60%]! xl:h-[50%]! text-sm! sm:text-base! lg:text-xl! xl:text-xl! 2xl:text-xl!"
          >
            {Object.entries(abilityScores).map(([key, value], index) => (
              <div
                key={key}
                className="grid grid-cols-3 grid-rows-0 w-full! xl:w-[80%]! 2xl:w-[80%]! mx-auto "
              >
                <span className="col-span-1 text-start">
                  {abilitiesName[index]}
                </span>
                <span
                  className={`col-span-2 text-end ${value < 10 ? "text-red-600" : "text-yellow-400"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </Card>
          <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            className="grow lg:text-2xl!"
            onPointerDown={handleCharacterCreation2}
          >
            Confirm my character
          </Button>
        </div>
      </section>
    </>
  );
}
