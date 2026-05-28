"use client";
import { useState } from "react";
import Image from "next/image";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function MerchantMenu({
  setChoosePurchaseAction,
  setChooseSellAction,
}: {
  setChoosePurchaseAction: React.Dispatch<React.SetStateAction<boolean>>;
  setChooseSellAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const vendorChoices = ["Purchase", "Sell"];
  const icons = ["/icons/items/buy.svg", "/icons/items/sell.svg"];
  const [hover, setHover] = useState("");

  return (
    <>
      <div className={`h-[70%] lg:h-full! w-full! lg:w-[70%]! flex flex-col md:flex-row items-center gap-2 ${retroGaming.className}`}>
        {vendorChoices.map((item: string, index: number) => (
          <div
            key={index}
            
            onPointerDown={() => {
              if (item === "Purchase") {
                setChoosePurchaseAction(true);
              } else {
                setChooseSellAction(true);
              }
            }}
            onMouseEnter={() =>
              setHover(() => {
                if (index === 0) {
                  return "Purchase";
                } else {
                  return "Sell";
                }
              })
            }
            onMouseLeave={() => setHover("")}
            className="w-[90%] md:w-[50%] h-full cursor-pointer hover:border-amber-300! border border-white! rounded-lg flex flex-col justify-center items-center gap-5"
          >
            <div className="w-[50%] md:w-[80%] ">
              <Image
                src={icons[index]}
                width={200}
                height={200}
                // fill={true}
                className="shrink-0 mx-auto"
                alt="vendor action"
                loading="eager"
                preload={true}
              />
            </div>
            <p
              className={`text-sm! md:text-xl ${item === hover ? "text-amber-300" : "text-white"}`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
