"use client";

import { useCombatStore } from "@/stores/useCombatStore";
import { useEffect, useRef, useState } from "react";
import Engine from "@/classes/Engine";
import { Moveset } from "@/types/types";

export default function CombatChoices({
  gameplay,
}: {
  gameplay: Engine;
}) {

  const movesets = useCombatStore((state) => state.movesets);
  const hasRoundStarted = useCombatStore((state) => state.hasRoundStarted);
  const updateRoundStatus = useCombatStore((state) => state.updateRoundStatus);
  const isInventoryOpened = useCombatStore((state) => state.isInventoryOpened);
  //



  const userAttacks = movesets;
  const userActions:Moveset[]= [{ type:"action", name: "inventory" }];
  const userConcatMoves = userActions.concat(userAttacks);
  const [userAllMoves, setUserAllMoves] = useState<Moveset[] | []>([]);


  useEffect(() => {

    while (userConcatMoves.length<12) {
      userConcatMoves.push({})
    };
    setUserAllMoves(userConcatMoves);
  }, [])




  return (
    <>
      <div
        id="combatChoices"
        className={`grid grid-cols-6 grid-rows-2 lg:grid-cols-12 lg:grid-rows-1 content-center items-center px-2! lg:px-5 gap-2 h-auto mb-2`}
      >
        {userAllMoves.map((move, key) => {
          return (
            <figure
              key={key}
              onPointerDown={() => {
                if (hasRoundStarted) return;
                updateRoundStatus(true);
                gameplay
                  .handlePlayerCombatChoices(move)
                  .then(() => updateRoundStatus(false));
              }}
              className={
                hasRoundStarted
                  ? `text-center border-2! cursor-not-allowed!  max-h-full! aspect-square overflow-hidden opacity-50 rounded-lg`
                  : `hover:border-3! text-center border-2! cursor-pointer!  max-h-full! aspect-square overflow-hidden ${move.name === "inventory" && isInventoryOpened ? "border-amber-400!" : "border-white"} rounded-lg`
              }
            >
              {move.name && (
                <img
                  src={`/icons/${move.name.toLowerCase()}.svg`}
                  alt=""
                  className="max-w-full h-auto"
                />
              )}
            </figure>
          );
        })}
      </div>
    </>
  );
}
