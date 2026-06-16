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
      <div className="fixed z-999 bottom-0 right-0 left-0 h-[15%] w-full border-t-2! border-white flex">
        <div
          id="bars-container"
          className="w-[20%]  h-full border-r-3! border-white! flex flex-col items-center justify-center p-2 gap-2"
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
          className="w-[15%] h-full border-r-3! border-white! flex flex-col items-center justify-center p-2 text-xs"
        >
          <p className="text-xs">
            {useCharacterStore.getState().character.username}
          </p>
          <p>{useCharacterStore.getState().character.race}</p>
          <p>{useCharacterStore.getState().character.user_class}</p>
          <p>lvl {useCharacterStore.getState().character.lvl}</p>
          <p>{useCharacterStore.getState().character.coins} gold</p>
        </div>

        <div
          id="movesets-container"
          className="w-[80%] h-full border! border-white! flex "
        >
          {displayedMoveset?.map((move, key) => {
            return (
              <figure
                key={key}
                className={`text-center border! max-h-full! aspect-square overflow-hidden rounded-lg`}
              >
                {move.name && (
                  <img
                    src={`${move.url}`}
                    alt=""
                    className="max-w-full h-auto"
                  />
                )}
              </figure>
            );
          })}
        </div>
        
      </div>
    </>
  );
}
