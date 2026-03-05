"use client";
import { useState } from "react";
import { Button, Card } from "pixel-retroui";
import Title from "./Title";
import presets from "../../assets/characterPresets.json";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";
import { Attributes } from "@/types/types";

export default function ClassSelection({
  indexTitle,
  setIndexTitleAction,
}: {
  indexTitle: number;
  setIndexTitleAction: React.Dispatch<React.SetStateAction<number>>;
}) {
  const classes = presets.classes;

  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);
  const draft = useCharacterCreationStore((state) => state.draft);
  const setAbilityScores = useCharacterCreationStore(
    (state) => state.setAbilityScores,
  );
  const resetPointsToSpare = useCharacterCreationStore(
    (state) => state.resetPointsToSpare,
  );
  const [classDescription, setClassDescription] = useState<string | undefined>(
    () =>
      draft.user_class
        ? classes.find((c) => c.class === draft.user_class)?.description
        : "Select a class to view its description.",
  );


  function updatingClassAndAbilityPoints(chosenClass?: string) {
    // if (!draft.user_class) return;

    // retrieving the selected class data
    const chosen = classes.find((n) => n.class === chosenClass);
    if (!chosen) return;
    // setClassDescription(chosen.description);

    // changing the preset abilities based on the selected class
    const abilities: Attributes = chosen.abilities;
    setAbilityScores(abilities);
    resetPointsToSpare(5);
  }

  return (
    <>
      <section
        className="w-full lg:w-[70%]! xl:w-[50%]! 2xl:w-[50%]! h-dvh mx-auto px-4 sm:px-6 md:px-8 py-10 
        grid grid-rows-[10%_50%_30%]   gap-5"
      >
        <Title
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitleAction}
        />

        <div
          id="classContainer"
          className="row-span-1 grid grid-rows-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-h-full xl:mt-10"
        >
          {classes.map((c) => (
            <Button
              key={c.class}
              bg="black"
              textColor={draft.user_class === c.class ? "yellow" : "white"}
              borderColor={draft.user_class === c.class ? "yellow" : "white"}
              data-id="class-option"
              onPointerDown={() => {
                updateDraft({ user_class: c.class });
                setClassDescription(c.description);
                updatingClassAndAbilityPoints(c.class)
              }}
              className={`px-4 max-h-full py-1! lg:py-5! xl:py-5! 2xl:py-5! 
              text-center cursor-pointer text-sm! sm:text-base! md:text-lg! lg:text-base! 
              2xl:text-2xl! text-wrap`}
            >
              {c.class}
            </Button>
          ))}
        </div>

        <Card
          bg="black"
          textColor="white"
          borderColor="white"
          shadowColor="white"
          data-id="class-option"
          className=" px-4 py-5! row-span-1 text-center 
          text-sm overflow-hidden"
        >
          {classDescription}
        </Card>
      </section>
    </>
  );
}
