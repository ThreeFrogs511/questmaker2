"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useState, useEffect} from "react";
import useSound from "use-sound";
export default function VendorToolbar({
  setChooseAction,
  notEnoughMoney,
  setNotEnoughMoneyAction
}: {
  setChooseAction: React.Dispatch<React.SetStateAction<boolean>>,
  notEnoughMoney: boolean,
  setNotEnoughMoneyAction: React.Dispatch<React.SetStateAction<boolean>>;

}) {
  const currentUser = useUserStore((state) => state.currentUser);
  const [errorMoney] = useSound('/sounds/error.mp3');
   const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!notEnoughMoney) return;
    setFlash(false);          // reset
    requestAnimationFrame(() => setFlash(true)); // force reflow next frame
    errorMoney();
    const t = setTimeout(() => {
      setFlash(false)
      setNotEnoughMoneyAction(false);
    }, 450);
    return () => clearTimeout(t);
  }, [notEnoughMoney]);


  return (
    <div className="flex justify-between w-full! lg:w-[70%]! mb-1 font-minecraft text-xs md:text-sm">
      <p>
        Your coins:{" "}
        <span className={`text-amber-300 ${flash ? "error-animate" : ""}`}>{currentUser?.coins}</span>
      </p>
     
      <div
        className="underline cursor-pointer hover:text-amber-300 font-minecraft"
        onPointerDown={() => setChooseAction(false)}
      >
        Go back
      </div>
    </div>
  );
}
