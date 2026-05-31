"use client";
import { useCombatStore } from "@/stores/useCombatStore";
import Engine from "@/classes/Engine";
import { Moveset, Item } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";
import localFont from "next/font/local";
import Image from "next/image";
import items from "@/assets/items.json";
import { useEffect, useState, useMemo } from "react";

const retroGaming = localFont({
  src: "../../../public/fonts/retro_gaming.ttf",
});

export default function InventoryCombatModal({
  gameplay,
}: {
  gameplay: Engine;
}) {
  // combat store
  const openInventory = useCombatStore((state) => state.openInventory);
  const hasRoundStarted = useCombatStore((state) => state.hasRoundStarted);
  const updateRoundStatus = useCombatStore((state) => state.updateRoundStatus);




  const [displayedInventory, setDisplayedInventory] = useState<Item[] | []>([]);

  useEffect(() => {
    const inventory = gameplay.getTempInventory();
    console.log(inventory)
    const tempInv: Array<Item> = [];

    for (let i = 0; i < inventory?.length; i++) {
      const matchingItem: Item | undefined = items.find(
        (n) => n.slug === inventory[i].slug,
      );

      if (!matchingItem) {
        continue;
      } else {
        const userItem: Item = {
          ...matchingItem,
          quantity: inventory[i].quantity,
        };
        tempInv.push(userItem);
      }
    }
    setDisplayedInventory(tempInv);
  }, []);

  function handleItemUse(item: Item) {
    if (hasRoundStarted) return;
    openInventory(false);
        const inventory = gameplay.getTempInventory();
    const newInventory = inventory.map((n) => {
      if ((n.slug === item.slug) && n.quantity) {
        return {...n, quantity:n.quantity-1}
      } else {
        return n
      }
    })
    .filter((n) => {
      if (n.quantity && n.quantity > 0) {
        return n
      }
    })
    console.log(newInventory)
    const combatItem: Moveset = {
      type: "item",
      name: item.name ?? "",
      target: item.effectTarget ?? "",
      value: item.effectValue ?? 0,
    };
    updateRoundStatus(true);
    gameplay.setTempInventoryInsideEngine(newInventory);
    gameplay
      .handlePlayerCombatChoices(combatItem)
      .then(() => updateRoundStatus(false));
  }

  return (
    <>
      <div
        className={`fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-998 flex justify-center items-center ${retroGaming.className}`}
      >
        <div className="h-[90%] w-[90%] bg-black overflow-hidden border-4! border-white! rounded-lg! p-5">
          <div
            className="cursor-pointer"
            onPointerDown={() => openInventory(false)}
          >
            Click to close
          </div>
          <section
            id="inventoryContainer"
            className={`w-full h-full flex flex-col scrollingContainer grow! gap-5 md:gap-2 px-0! ${retroGaming.className}`}
          >
            {displayedInventory.map((item: Item, key: number) => (
              <figure
                key={key}
                className="grid grid-cols-4 items-center px-2 hover:border-amber-300! max-h-[15%]! min-h-[15%]! md:max-h-[20%]! md:min-h-[20%]! text-center border-2! p-1 md:p-5 cursor-pointer! rounded"
              >
                <div className="flex items-center gap-4 col-span-3 ">
                  <Image
                    src={item.imageUrl ?? ""}
                    width={48}
                    height={48}
                    className="shrink-0"
                    alt={item.slug ?? ""}
                  />
                  <p className="text-sm md:text-base!">{item.name ?? ""}</p>
                  <span className="hidden md:block">-</span>
                  <p className="hidden md:block md:text-xs">
                    {item.description ?? " "}
                  </p>
                  <span>-</span>
                  <div className="flex gap-1 justify-center ">
                    Qty:
                    <span className="text-amber-300">
                      {item.quantity ?? " "}
                    </span>
                  </div>
                </div>

                {/* CTA depending on the page : selling, equip or use item */}
                <div
                  className="underline cursor-pointer hover:text-amber-300"
                  onPointerDown={() => handleItemUse(item)}
                >
                  {item.type === "consumable" && "Use"}
                  {item.type === "weapon" && "Equip"}
                </div>
              </figure>
            ))}
            {displayedInventory.length <= 0 && (
              <div className="h-full w-full flex justify-center items-center">
                <p>No items yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
