"use client";
import { useInventoryStore } from "@/stores/useInventoryStore";
import Image from "next/image";
import { Store } from "@/types/types";
import items from "@/assets/items.json";
import { useEffect } from "react";
import { useState} from "react";
import { usePathname } from "next/navigation";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function UserItems({userActionOnItems, mode} : {userActionOnItems: (item:Store, id?:number) => void, mode?: "combat"}) {

  const pathname = usePathname();
  const inventory = useInventoryStore((state) => state.inventory);
  const [displayedInventory, setDisplayedInventory] = useState<Array<Store> | []>([]);


  useEffect(() => {
    if (!inventory) return;
    const tempInv: Array<Store> = [];

    for (let i = 0; i < inventory?.length; i++) {
      const matchingItem: Store | undefined = items.find(
        (n) => n.slug === inventory[i].slug,
      );

      if (!matchingItem) {
        continue;
      } else {
        const userItem: Store = {
          ...matchingItem,
          quantity: inventory[i].quantity,
        };
        tempInv.push(userItem);
      }
    }
    setDisplayedInventory(mode === "combat" ? tempInv.filter(i => i.type === "consumable") : tempInv ?? []);
  }, [inventory, mode]);


  return (
    <>
      <section
        id="inventoryContainer"
        className={`w-full h-full flex flex-col scrollingContainer grow! gap-5 md:gap-2 px-0! ${retroGaming.className}`}
      >
 
        {displayedInventory.map((item: Store, key: number) => (
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
              {pathname==="/vendor" && 
              <div className="flex gap-3">
              <span>-</span>
                <div className="flex gap-1 justify-center ">
                  <span className="text-amber-300">{item.price?? " "}</span>g
                </div>
              </div>}

            </div>

            {/* CTA depending on the page : selling, equip or use item */}
            <div className="underline cursor-pointer hover:text-amber-300" onPointerDown={() => userActionOnItems(item)}>
              {pathname === "/merchant/sell" && "Sell"}
              {pathname === "/inventory" && item.type === "consumable" && "Use"}
              {pathname === "/inventory" && item.type !== "consumable" && "Equip"}
              {mode === "combat" && "Use"}
            </div>
          </figure>
        ))}
        {displayedInventory.length <= 0 && <div className="h-full w-full flex justify-center items-center"><p>No items yet.</p></div>}
      </section>
    </>
  );
}
