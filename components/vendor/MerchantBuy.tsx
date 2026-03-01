"use client";
import { useRef } from "react";
import { Store } from "@/types/types";
import items from "@/assets/items.json";
import Image from "next/image";
import useSound from "use-sound";
import { useUserStore } from "@/stores/useUserStore";
import { useInventoryStore } from "@/stores/useInventoryStore";


export default function MerchantBuy({
  setChoosePurchaseAction,
}: {
  setChoosePurchaseAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats)
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const inventory = useInventoryStore((state) => state.inventory);
  const isBuying = useRef(false);

  const [play] = useSound(`/sounds/buy.mp3`, {
    interrupt: true,
    preload: true,
  });

  async function handlePurchase(item:Store) {
    if (!inventory) return;
    const r = await fetch(`api/inventory/${currentUser?.id}`,{
      method: "POST",
      headers:{"content-type":"applicaiton/json"},
      body: JSON.stringify(item)
    });
    const feedback = await r.json();
    if (feedback?.success) {
      console.log(feedback.items)
      updateInventory(feedback.items);
      updateStats({coins:feedback.coins});
      play();
    };
    if (feedback?.error) {
      console.log('error:', feedback.error);
    }

    if (feedback?.broke) {
      
    }
    isBuying.current = false;
  };

  
  return (
    <div className=" lg:w-[70%]! h-full! flex flex-col w-full overflow-hidden grow">
      {/* <VendorToolbar setChooseAction={setChoosePurchaseAction} /> */}
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
              onPointerDown={() => {
                if (isBuying.current) return;
                isBuying.current = true;
                handlePurchase(item);
              }}
            >
              Buy
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
