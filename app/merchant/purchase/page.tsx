"use client";
import { useRef, useState } from "react";
import { Store } from "@/types/types";
import items from "@/assets/items.json";
import Image from "next/image";
import useSound from "use-sound";
import { useUserStore } from "@/stores/useUserStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import MerchantToolbar from "@/components/Merchant/MerchantToolBar";

export default function MerchantPurchase() {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats);
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const inventory = useInventoryStore((state) => state.inventory);
  const isBuying = useRef(false);
  const [notEnoughMoney, setNotEnoughMoney] = useState(false);

  const [play] = useSound(`/sounds/buy.mp3`, {
    interrupt: true,
    preload: true,
  });

  //Using optmistic UI to avoid long loading times
  async function handlePurchase(item: Store) {
    //prevents double-clicking
    if (!inventory || isBuying.current) return;
    isBuying.current = true;

    if ((currentUser?.coins ?? 0) < (item.price ?? 0)) {
      setNotEnoughMoney(true);
      isBuying.current = false;
      return;
    };

    // Saving old inventory state for rollback
    const previousInventory = [...inventory];
    const previousCoins = currentUser?.coins ?? 0;

    play();

    //Updating the state before the database for the optimistic UI
    const optimisticInventory = [...inventory];
    //We check if the item already exists in the user's inventory
    const existingIdx = optimisticInventory.findIndex(
      (i) => i.slug === item.slug,
    );

    //We add the item if it doesn't exist, else we just increment the quantity
    if (existingIdx >= 0) {
      optimisticInventory[existingIdx] = {
        ...optimisticInventory[existingIdx],
        quantity: (optimisticInventory[existingIdx].quantity ?? 0) + 1,
      };
    } else {
      optimisticInventory.push({
        inventory_id: null,
        slug: item.slug,
        user_id: currentUser?.id ?? null,
        quantity: 1,
      });
    }
    updateInventory(optimisticInventory);
    updateStats({ coins: previousCoins - (item.price ?? 0) });

    //we finally update the database
    //we rollback when an error occurs
    try {
      const r = await fetch(`../api/inventory/${currentUser?.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(item),
      });
      const feedback = await r.json();

      if (feedback?.success) {
        setNotEnoughMoney(false);
        // Sync with authoritative server data
        updateInventory(feedback.items);
        updateStats({ coins: feedback.coins });
      }

      if (feedback?.broke) {
        // Rollback optimistic update
        updateInventory(previousInventory);
        updateStats({ coins: previousCoins });
        setNotEnoughMoney(true);
      }

      if (feedback?.error) {
        // Rollback optimistic update
        updateInventory(previousInventory);
        updateStats({ coins: previousCoins });
        console.log("error:", feedback.error);
      }
    } catch (e) {
      updateInventory(previousInventory);
      updateStats({ coins: previousCoins });
      console.log("error:", (e as Error).message);
    };
    
    isBuying.current = false;
  }

  return (
    <>
      <div className=" lg:w-[80%]! lg:mx-auto h-full! flex flex-col w-full overflow-hidden grow">
        <MerchantToolbar
          notEnoughMoney={notEnoughMoney}
          setNotEnoughMoneyAction={setNotEnoughMoney}
        />
        <div className="scrollingContainer h-full! flex flex-col gap-5 md:gap-2 ">
          {items?.map((item: Store, index: number) => (
            <figure
              key={index}
              className="grid grid-cols-4 items-center px-2 hover:border-amber-300! max-h-[15%]! min-h-[15%]! md:max-h-[20%]! md:min-h-[20%]! text-center border-2! p-1 md:p-5 cursor-pointer! rounded"
            >
              <div className="flex gap-5 items-center col-span-3 ">
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
                <div className="flex gap-1">
                  <p className="text-amber-300">{item.price ?? " "}</p>g
                </div>
              </div>
              <div
                className="underline cursor-pointer hover:text-amber-300"
                onPointerDown={() => handlePurchase(item)}
              >
                Buy
              </div>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
