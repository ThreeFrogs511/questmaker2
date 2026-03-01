"use client";
import { useUserStore } from "@/stores/useUserStore";
import UserItems from "../inventory/UserItems";
import { usePathname } from "next/navigation";
import { Store } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";
import useSound from "use-sound";


export default function MerchantSell({
  setChooseSellAction,
}: {
  setChooseSellAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats)
  const pathname = usePathname();
  const updateInventory = useInventoryStore((state) => state.updateInventory);

    const [play] = useSound(`/sounds/sell.mp3`, {
      interrupt: true,
      preload: true,
    });


  async function sellingItems(item:Store) {
  if (pathname ==="/vendor") {
      const r = await fetch(`/api/inventory/${currentUser?.id}`, {
        method: "PATCH",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(item)
      });
      const feedback = await r.json();
      if (feedback.success) {
          updateInventory(feedback.list);
          updateStats({coins:feedback.coins});
          play();
      }
    
    }
  }

  return (
    <>
      <UserItems userActionOnItems={sellingItems}/>
    </>
  );
}
