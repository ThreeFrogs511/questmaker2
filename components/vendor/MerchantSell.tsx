"use client";
import { useUserStore } from "@/stores/useUserStore";

export default function MerchantSell({
  setChooseSellAction,
}: {
  setChooseSellAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useUserStore((state) => state.currentUser);

  return <></>;
}
