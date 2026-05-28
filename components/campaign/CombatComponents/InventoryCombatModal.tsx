"use client";
import { useCombatStore } from "@/stores/useCombatStore";
import Engine from "@/classes/Engine";
import { Store, CombatConsumableItem } from "@/types/types";
import UserItems from "@/components/inventory/UserItems";
import { useInventoryStore } from "@/stores/useInventoryStore";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function InventoryCombatModal({
  gameplay,
  setSoundEffectAction,
}: {
  gameplay: Engine;
  setSoundEffectAction: (effect: string) => void;
}) {
  // combat store
  const openInventory = useCombatStore((state) => state.openInventory);
  const hasRoundStarted = useCombatStore((state) => state.hasRoundStarted);
  const updateRoundStatus = useCombatStore((state) => state.updateRoundStatus);
  const decrementInventory = useInventoryStore(
    (state) => state.decrementInventory,
  );

  function handleItemUse(item: Store) {
    if (hasRoundStarted) return;
    openInventory(false);
    decrementInventory(item.slug ?? "");
    const combatItem: CombatConsumableItem = {
      type: "item",
      name: item.name ?? "",
      target: item.effectTarget ?? "",
      value: item.effectValue ?? 0,
    };
    updateRoundStatus(true);
    gameplay
      .handlePlayerCombatChoices(combatItem)
      .then(() => updateRoundStatus(false));
  }

  return (
    <>
      <div className={`fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-998 flex justify-center items-center ${retroGaming.className}`}>
        <div className="h-[90%] w-[90%] bg-black overflow-hidden border-4! border-white! rounded-lg! p-5">
          <div
            className="cursor-pointer"
            onPointerDown={() => openInventory(false)}
          >
            Click to close
          </div>
          <UserItems userActionOnItems={handleItemUse} mode="combat" />
        </div>
      </div>
    </>
  );
}
