"use client";
import UserItems from "@/components/inventory/UserItems";
import Header from "@/components/global/Header";
import HitpointsBar from "@/components/userStats/HitpointsBar";
import DopamineBar from "@/components/userStats/DopamineBar";
import Item from "@/classes/Item";
import Loading from "@/app/loading";
import { useUserContext } from "@/context/context";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function InventoryClient() {
  const { isAuthenticated, isProfileCompleted } = useUserContext();

  if (!isAuthenticated || !isProfileCompleted) {
    return <Loading />;
  }

  return (
    <>
      <div className={`wrapper overflow-hidden ${retroGaming.className}`}>
        <Header />

        <div>
          <h1 className="text-2xl text-center text-amber-300 mb-5">
            Inventory
          </h1>
          <div className="grid grid-cols-2  max-w-[70%] mx-auto mb-2">
            <HitpointsBar />
            <DopamineBar />
          </div>
          <UserItems userActionOnItems={new Item().useConsumable} />
        </div>
      </div>
    </>
  );
}
