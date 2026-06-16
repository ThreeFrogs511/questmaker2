"use client";
import Header from "@/components/global/Header";
import HitpointsBar from "@/components/userStats/HitpointsBar";
import DopamineBar from "@/components/userStats/DopamineBar";
import ItemClass from "@/classes/ItemClass";
import { Item  as ItemType} from "@/types/types";
import localFont from 'next/font/local'
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import items from "@/assets/items.json";

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function InventoryClient() {

  const inventory = useInventoryStore((state) => state.inventory);
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const [displayedInventory, setDisplayedInventory] = useState<ItemType[] | []>([])

  useEffect(() => {
    if (!inventory) return;
    const tempInv: Array<ItemType> = [];
    for (let i = 0; i < inventory?.length; i++) {
      const matchingItem: ItemType | undefined = items.find(
        (n) => n.slug === inventory[i].slug,
      );

      if (!matchingItem) {
        continue;
      } else {
        const userItem: ItemType = {
          ...matchingItem,
          quantity: inventory[i].quantity,
        };
        tempInv.push(userItem);
      }
    }
    setDisplayedInventory([...tempInv]);
  }, [inventory]);



  

  return (
    <>
      <div className={`wrapper overflow-hidden ${retroGaming.className}`}>
        <Header />

        <div>
          <h1 className="text-2xl text-center text-amber-300 mb-5">
            Inventory
          </h1>
          <div className="grid grid-cols-2  max-w-[70%] mx-auto mb-2">
            <HitpointsBar />
            <DopamineBar />
          </div>
      <section
        id="inventoryContainer"
        className={`w-full h-full flex flex-col scrollingContainer grow! gap-5 md:gap-2 px-0! ${retroGaming.className}`}
      >
        {displayedInventory.map((item: ItemType, key: number) => (
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
            
            </div>

            {/* CTA depending on the page : selling, equip or use item */}
            <div
              className="underline cursor-pointer hover:text-amber-300"
              onPointerDown={async () => {
                console.log(item)
                const itemToUse = new ItemClass(item);
                const r = await itemToUse.handler();
                if (r?.success === false) {
                  const previousInv = itemToUse.getSnapshotPlayerData();
                  updateInventory([...previousInv.inventory]);
                };

              }}
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
