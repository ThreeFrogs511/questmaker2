"use client";
import { useRef } from "react";
import { Store } from "@/types/types";
import items from "@/assets/items.json";
import Image from "next/image";
import useSound from "use-sound";
import { useUserStore } from "@/stores/useUserStore";

export default function MerchantBuy({
  setChoosePurchaseAction,
}: {
  setChoosePurchaseAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useUserStore((state) => state.currentUser);
  const isBuying = useRef(false);

  const [play] = useSound(`/sounds/buy.mp3`, {
    interrupt: true,
    preload: true,
  });
  return (
    <div className=" lg:w-[70%]! h-full! flex flex-col w-full overflow-hidden grow">
      <div className="flex flex-start! justify-between  mb-1 font-minecraft text-xs md:text-lg">
        <p>
          Your coins : <span className="text-amber-300">{currentUser.coins}</span>
        </p>
        <div>
          Filter by
        </div>
        <div
          className="underline cursor-pointer hover:text-amber-300 font-minecraft"
          onPointerDown={() => setChoosePurchaseAction(false)}
        >
          Go back
        </div>
      </div>
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
              <p className="text-sm md:text-base!">{item.name ?? " "}</p>
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
                play();
                setTimeout(() => {
                  isBuying.current = false;
                }, 1000);
                
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
