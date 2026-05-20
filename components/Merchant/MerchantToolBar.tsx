"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useState, useEffect } from "react";
import useSound from "use-sound";
import { useRouter } from "next/navigation";

interface MerchantToolbarProps {
  notEnoughMoney?: boolean;
  setNotEnoughMoneyAction?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MerchantToolbar({
  notEnoughMoney,
  setNotEnoughMoneyAction,
}: MerchantToolbarProps) {

  const currentUser = useUserStore((state) => state.currentUser);
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
    <div className="w-[90%] mx-auto flex justify-between mb-4 font-minecraft text-xs md:text-sm">
      <p>
        Your coins:{" "}
        <span className={`text-amber-300 ${flash ? "error-animate" : ""}`}>
          {currentUser?.coins}
        </span>
      </p>

      <div
        className="underline cursor-pointer hover:text-amber-300 font-minecraft"
        onPointerDown={() => router.back()}
      >
        Go back
      </div>
    </div>
  );
}
