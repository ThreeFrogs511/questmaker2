"use client";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useState, useEffect } from "react";
import useSound from "use-sound";
import { useRouter } from "next/navigation";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

interface MerchantToolbarProps {
  notEnoughMoney?: boolean;
  setNotEnoughMoneyAction?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MerchantToolbar({
  notEnoughMoney,
  setNotEnoughMoneyAction,
}: MerchantToolbarProps) {

  const character = useCharacterStore((state) => state.character);
  const [errorMoney] = useSound("/sounds/error.mp3");
  const [flash, setFlash] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    if (!notEnoughMoney || !setNotEnoughMoneyAction) return;
    setFlash(false); // reset
    requestAnimationFrame(() => setFlash(true)); // force reflow next frame
    errorMoney();
    const t = setTimeout(() => {
      setFlash(false);
      setNotEnoughMoneyAction(false);
    }, 450);
    return () => clearTimeout(t);
  }, [notEnoughMoney]);

  return (
    <div id="merchant-toolbar" className={`w-[90%] mx-auto flex justify-between mb-4 text-xs md:text-sm ${retroGaming.className}`}>
      <p>
        Your coins:{" "}
        <span className={`text-amber-300 ${flash ? "error-animate" : ""}`}>
          {character?.coins}
        </span>
      </p>

      <div
        className="underline cursor-pointer hover:text-amber-300"
        onPointerDown={() => router.back()}
      >
        Go back
      </div>
    </div>
  );
}
