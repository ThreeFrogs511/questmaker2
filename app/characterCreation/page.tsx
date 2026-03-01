"use client";
import NameGenderSelection from "@/components/characterCreationComponents/NameGenderSelection";
import RaceSelection from "@/components/characterCreationComponents/RaceSelection";
import ClassSelection from "@/components/characterCreationComponents/ClassSelection";
import AbilityScoresSelection from "@/components/characterCreationComponents/AbilityScoresSelection";
import SummaryCreation from "@/components/characterCreationComponents/SummaryCreation";
import { useState } from "react";

export default function CharacterCreation() {
  // determines which title and page to display
  const [indexTitle, setIndexTitle] = useState(0);

  return (
    <>
      {indexTitle === 0 && (
        <NameGenderSelection
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitle}
        />
      )}

      {indexTitle === 1 && (
        <RaceSelection
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitle}
        />
      )}

      {indexTitle === 2 && (
        <ClassSelection
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitle}
        />
      )}

      {indexTitle === 3 && (
        <AbilityScoresSelection
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitle}
        />
      )}

      {indexTitle === 4 && (
        <SummaryCreation
          indexTitle={indexTitle}
          setIndexTitleAction={setIndexTitle}
        />
      )}
    </>
  );
}
