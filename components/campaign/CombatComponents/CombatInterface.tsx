"use client";
import HitpointsBar from "../../userStats/HitpointsBar";
import { ProgressBar } from "pixel-retroui";
import { useState} from "react";
import localFont from 'next/font/local'
import items from "@/assets/items.json";
import CombatChoices from "./CombatChoices";
import InventoryCombatModal from "./InventoryCombatModal";
import parse from "html-react-parser"; // used to interpret HTML in JSON
import { useEffect, useRef } from "react";
import { Item } from "@/types/types";
import TempHitpointsBar from "./TempHitpointsBar";
import { useCombatStore } from "@/stores/useCombatStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import Engine from "@/classes/Engine";

const retroGaming = localFont({
  src: '../../../public/fonts/retro_gaming.ttf',
})

export default function CombatInterface({ gameplay }: { gameplay: Engine }) {
  // combat store
  const combatLog = useCombatStore((state) => state.combatLog);
  const enemy = useCombatStore((state) => state.enemy);
  const nbOfTurn = useCombatStore((state) => state.nbOfTurn);
  const hasRoundStarted = useCombatStore((state) => state.hasRoundStarted);
  const isInventoryOpened = useCombatStore((state) => state.isInventoryOpened);
  const tempPlayerData = useCombatStore((state) => state.tempPlayerData)


  // local states
  const [loader, setLoader] = useState(false);
  const [enemyFullHealth] = useState<number | undefined>(enemy?.hp);
  const enemyHealth =
    enemy?.hp && enemyFullHealth ? enemy.hp / enemyFullHealth : undefined;


  //loader
  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 50);
  }, []);



  return (
    <>
      {!loader && (
        <div
          id="loaderHider"
          className="fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-998 bg-black"
        ></div>
      )}

      <section
        id="combatInterface"
        className={`fixed w-dvw h-dvh top-0 bottom-0 right-0 left-0 flex flex-col bg-black ${retroGaming.className}`}
      >
        <h2
          id="turn"
          className=" lg:text-4xl! font-bold text-center  h-[5dvh] mt-5!"
        >
          Turn <span className="text-amber-400">{nbOfTurn}</span>
        </h2>
         
          <h3 className=" mt-1! lg:text-2xl! font-bold text-center  min-h-[5dvh]! max-h-[5dvh]!">
            {!hasRoundStarted ? "Make a move !" : null}
          </h3>
        
        <div id="arena" className=" h-[80dvh]">
          <div id="healthBars" className="flex items-center h-[70%] ">
            <div id="userSide" className="w-[80%] lg:w-[50%] mx-auto">
              <div className="text-center flex flex-col">
                {tempPlayerData?.username ?? "You"}
                <span>AC : {tempPlayerData?.ac}</span>
                <span>
                  {Math.floor(
                    tempPlayerData?.hp
                      ? tempPlayerData.hp - tempPlayerData.damage_taken
                      : 10 - (tempPlayerData?.damage_taken ?? 0),
                  ) +
                    "/" +
                    tempPlayerData?.hp}
                </span>
              </div>
              <div className="w-[70%] mx-auto">
                {/* <HitpointsBar /> */}
                <TempHitpointsBar gameplay={gameplay} />
              </div>
            </div>

            <div className="w-[10%] h-full flex items-center justify-center text-xl">
              VS
            </div>

            <div id="enemySide" className="w-[80%] lg:w-[50%]  mx-auto">
              <div className="text-center flex flex-col justify-between">
                {enemy?.name}
                <span>AC : {enemy?.ac ?? 10}</span>
                <span>
                  {enemy
                    ? `${Math.max(0, Math.floor(enemy.hp ?? 0))}/${enemyFullHealth ?? 0}`
                    : null}
                </span>
              </div>
              <div className="w-[70%] mx-auto">
                <ProgressBar
                  size="sm"
                  color="red"
                  borderColor="white"
                  className="w-full"
                  progress={
                    enemyFullHealth && enemyHealth && enemy?.hp
                      ? enemy.hp > 0
                        ? enemyHealth * 100
                        : 0
                      : 0
                  }
                />
              </div>
            </div>
          </div>
          <div id="combatLog" className="h-[30%]">
            <div className="text-center mt-5">{parse(combatLog ?? ``)}</div>
          </div>
        </div>
        <CombatChoices
          gameplay={gameplay}
        />
        {isInventoryOpened && (
          <InventoryCombatModal
            gameplay={gameplay}
          />
        )}
      </section>
    </>
  );
}
