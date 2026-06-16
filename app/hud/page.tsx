"use client";

import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useEffect, useState } from "react";
import { Moveset } from "@/types/types";
import movesetsTemplate from '@/assets/movesets.json';

export default function HUD() {
  const [displayedMoveset, setDisplayedMoveset] = useState<Moveset[] | []>([]);
  const movesets = useCombatStore.getState().movesets;

  useEffect(() => {
    if (!useCharacterStore.getState().character.character_id) return;
    const onlyActivatedSkills = movesets.filter((n) => n.is_skill_activated);

    let fullyDetailedSkills = [];
    for (let skill of onlyActivatedSkills) {
      const s = movesetsTemplate.find((n) => n.name === skill.name) as Moveset;
      if (s) {
        s.character_id = useCharacterStore.getState().character.character_id as number;
        s.is_skill_activated = true;
        fullyDetailedSkills.push(s);
      }
    }
    if (!fullyDetailedSkills) return;

    while (fullyDetailedSkills.length < 12) {
     fullyDetailedSkills.push({});
    };
    setDisplayedMoveset([...fullyDetailedSkills]);

  }, [movesets]);
  return (
    <>
      <div className="fixed z-999 bottom-0 right-0 left-0 h-[13%] w-[80%] border-2! mx-auto border-white grid grid-cols-20 grid-rows-1">
        <div
          id="bars-container"
          className="col-span-10 h-full border-r! border-white! flex flex-col items-center justify-center p-2 gap-2"
        >
          <div id="hp-bar" className="w-[80%] h-full border! border-white! ">
            <div
              id="hp-bar-content"
              className="w-full! h-full! bg-red-800"
            ></div>
          </div>

          <div id="dp-bar" className="w-[80%] h-full border! border-white! ">
            <div
              id="dp-bar-content"
              className="w-full! h-full! bg-blue-600 "
            ></div>
          </div>

          <div id="xp-bar" className="w-[80%] h-full border! border-white! ">
            <div
              id="xp-bar-content"
              className="w-full! h-full! bg-green-500"
            ></div>
          </div>
        </div>

        <div
          id="main-stats-container"
          className="col-span-5 h-full border-r! border-l! border-white! grid grid-cols-4! text-sm "
        >
          <div className="flex flex-col items-center col-span-2">
          <p >
            {useCharacterStore.getState().character.username}
          </p>
          <p>{useCharacterStore.getState().character.race}</p>
          <p>{useCharacterStore.getState().character.user_class}</p>
          </div>
          <div className="col-span-2 flex items-center justify-center">
          <p className="text-xl!">lvl {useCharacterStore.getState().character.lvl}</p>
          </div>
        </div>

        <div id="gold-container" className="col-span-3 h-full border-r! border-l! border-white! flex gap-1 flex-wrap text-xs">
          <p>{useCharacterStore.getState().character.coins} gold</p>  
        </div>

        <div
          id="???-container"
          className="col-span-2 h-full flex border-white!"
        >
         
        </div>

      </div>
    </>
  );
}
