"use client";
import { useState } from "react";
import Image from "next/image";
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
      <div className="h-[80%] w-full! lg:w-[70%]! flex flex-col md:flex-row items-center gap-2">
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
            <Image
              src={icons[index]}
              width={200}
              height={200}
              className="shrink-0"
              alt="vendor action"
            />
            <p
              className={`font-minecraft text-sm! md:text-xl ${item === hover ? "text-amber-300" : "text-white"}`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
