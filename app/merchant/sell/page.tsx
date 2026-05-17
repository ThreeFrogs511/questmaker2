"use client";
import { useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { usePathname } from "next/navigation";
import { Store } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";
import useSound from "use-sound";
import { useRouter } from "next/navigation";
import UserItems from "@/components/inventory/UserItems";
import MerchantToolbar from "@/components/Merchant/MerchantToolBar";

export default function MerchantSell() {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats);
  const pathname = usePathname();
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const inventory = useInventoryStore((state) => state.inventory);
  const isSelling = useRef(false);

  const [play] = useSound(`/sounds/sell.mp3`, {
    interrupt: true,
    preload: true,
  });


  //Using optmistic UI to avoid long loading times
  async function sellingItems(item: Store) {

    //prevents double-clicking
    if (pathname !== "/merchant/sell" || isSelling.current) return;
    isSelling.current = true;

    // Saving old inventory state for rollback
    const previousInventory = inventory ? [...inventory] : null;
    const previousCoins = currentUser?.coins ?? 0;

    play();

    //Updating the state before the database for the optimistic UI
    //we store in a temp inventory the current inventory and the item sold
    //with -1 in quantity
    //If the item quantity < 0, we don't return
    if (item.slug) {
      const optimisticInventory = (inventory ?? [])
        .map((i) =>
          i.slug === item.slug ? { ...i, quantity: (i.quantity ?? 1) - 1 } : i,
        )
        .filter((i) => (i.quantity ?? 0) > 0);
      updateInventory(optimisticInventory);
    };

    //Optimistic UI : we also update the coins before the database
    updateStats({ coins: previousCoins + (item.price ?? 0) });

    //we finally update the database
    //we rollback when an error occurs
    try {
      const r = await fetch(`../api/inventory/${currentUser?.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(item),
      });
      const feedback = await r.json();

      if (feedback.success) {
        // Sync with authoritative server data
        updateInventory(feedback.list);
        updateStats({ coins: feedback.coins });
      } else {
        // Rollback optimistic update
        if (previousInventory !== null) updateInventory(previousInventory);
        updateStats({ coins: previousCoins });
      }
    } catch (e) {
      //in case of server error 
      if (previousInventory !== null) updateInventory(previousInventory);
      updateStats({ coins: previousCoins });
    }

    isSelling.current = false;
  }

  return (
    <div className=" lg:w-[80%]! lg:mx-auto h-full! flex flex-col w-full overflow-hidden grow">
      <MerchantToolbar />
      <UserItems userActionOnItems={sellingItems} />
    </div>
  );
}
