"use client";
import { useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import UserItems from "../inventory/UserItems";
import { usePathname } from "next/navigation";
import { Store } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";
import useSound from "use-sound";
import { useRouter } from "next/navigation";
import MerchantToolbar from "./MerchantToolBar";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function MerchantSell() {
  const currentUser = useUserStore((state) => state.currentUser);
  const character = useCharacterStore((state) => state.character);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const pathname = usePathname();
  const router = useRouter();
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const inventory = useInventoryStore((state) => state.inventory);
  const isSelling = useRef(false);

  const [play] = useSound(`/sounds/sell.mp3`, {
    interrupt: true,
    preload: true,
  });

  async function sellingItems(item: Store) {
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

    const r = await fetch(`/api/inventory/${currentUser?.user_id}`, {
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
    <div className={` lg:w-[80%]! lg:mx-auto h-full! flex flex-col w-full overflow-hidden grow ${retroGaming.className}`}>
      <MerchantToolbar />
      <UserItems userActionOnItems={sellingItems} />
    </div>
  );
}
