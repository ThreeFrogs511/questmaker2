"use client";

import { useCombatStore } from "@/stores/useCombatStore";
import Engine from "@/classes/Engine";

export default function CombatChoices({ gameplay }: { gameplay: Engine }) {


  // we take the actual movesets and hydrate the temporary movesets state
  const tempMovesets = useCombatStore((state) => state.tempMovesets);

  const hasRoundStarted = useCombatStore((state) => state.hasRoundStarted);
  const updateRoundStatus = useCombatStore((state) => state.updateRoundStatus);

  const isInventoryOpened = useCombatStore((state) => state.isInventoryOpened);
  const openInventory = useCombatStore((state) => state.openInventory);

  if (tempMovesets.length <=0) {
    return null
  } else {
  return ( 
    <>
      <div
        id="combatChoices"
        className={`grid grid-cols-6 grid-rows-2 lg:grid-cols-12 lg:grid-rows-1 content-center items-center px-2! lg:px-5 gap-2 h-auto mb-2`}
      >
        {tempMovesets?.map((move, key) => {
          return (
            <figure
              key={key}
              onPointerDown={() => {
                if (hasRoundStarted) return;
                if (move.name ==="inventory") {
                  openInventory(true);
                  return;
                };
                
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
}
