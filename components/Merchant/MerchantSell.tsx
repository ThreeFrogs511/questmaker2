"use client";
import { useRef, useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { usePathname } from "next/navigation";
import { Item } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";
import useSound from "use-sound";
import items from "@/assets/items.json";
import Image from "next/image";


export default function MerchantSell() {
  const currentUser = useUserStore((state) => state.currentUser);
  const character = useCharacterStore((state) => state.character);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const isSelling = useRef(false);

  const [play] = useSound(`/sounds/sell.mp3`, {
    interrupt: true,
    preload: true,
  });

  const pathname = usePathname();
  const inventory = useInventoryStore((state) => state.inventory);
  const [displayedInventory, setDisplayedInventory] = useState<Item[] | []>([]);


  useEffect(() => {
    if (!inventory) return;
    // console.log(inventory)
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
    setDisplayedInventory(tempInv)
  }, [inventory]);

  async function sellingItems(item: Item) {
    if (pathname !== "/vendor" || isSelling.current) return;
    isSelling.current = true;

    // Snapshots for rollback
    const previousInventory = inventory ? [...inventory] : null;
    const previousCoins = character?.coins ?? 0;

    // Optimistic update: play sound and update UI immediately
    play();
    if (item.slug) {
      const optimisticInventory = (inventory ?? [])
        .map((i) =>
          i.slug === item.slug ? { ...i, quantity: (i.quantity ?? 1) - 1 } : i,
        )
        .filter((i) => (i.quantity ?? 0) > 0);
      updateInventory(optimisticInventory);
    }
    updateCharacter({ coins: previousCoins + (item.price ?? 0) });

    const r = await fetch(`/api/inventory/${character?.character_id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item),
    });
    const feedback = await r.json();

    if (feedback.success) {
      // Sync with authoritative server data
      updateInventory(feedback.list);
      updateCharacter({ coins: feedback.coins });
    } else {
      // Rollback optimistic update
      if (previousInventory !== null) updateInventory(previousInventory);
      updateCharacter({ coins: previousCoins });
    }

    isSelling.current = false;
  }

  return (
    <>
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
                <span className="text-amber-300">{item.quantity ?? " "}</span>
              </div>
              {/* pricing */}
              {pathname === "/vendor" && (
                <div className="flex gap-3">
                  <span>-</span>
                  <div className="flex gap-1 justify-center ">
                    <span className="text-amber-300">{item.price ?? " "}</span>g
                  </div>
                </div>
              )}
            </div>

            {/* CTA depending on the page : selling, equip or use item */}
            <div
              className="underline cursor-pointer hover:text-amber-300"
              onPointerDown={() => sellingItems(item)}
            >
              Sell
            </div>
          </figure>
        ))}
        {displayedInventory.length <= 0 && (
          <div className="h-full w-full flex justify-center items-center">
            <p>No items yet.</p>
          </div>
        )}
    </>
  );
}
