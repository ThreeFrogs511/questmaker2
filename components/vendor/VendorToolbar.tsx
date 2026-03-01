"use client";
import { useUserStore } from "@/stores/useUserStore";

export default function VendorToolbar({
  setChooseAction,
}: {
  setChooseAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useUserStore((state) => state.currentUser);
  return (
    <div className="flex justify-between w-full! lg:w-[70%]! mb-1 font-minecraft text-xs md:text-sm">
      <p>
        Your coins:{" "}
        <span className="text-amber-300">{currentUser?.coins}</span>
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
