"use client";
import HitpointsBar from "../../userStats/HitpointsBar";
import { ProgressBar } from "pixel-retroui";
import { useState} from "react";
import localFont from 'next/font/local'


import CombatChoices from "./combatChoices";
import InventoryCombatModal from "./InventoryCombatModal";

// used to interpret HTML in JSON
import parse from "html-react-parser";
import { useEffect } from "react";

import useSound from "use-sound";

import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
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
  const soundEffect = useCombatStore((state)=> state.soundEffect);
  const playSoundEffect = useCombatStore((state)=> state.playSoundEffect);
  

  // local states
  const [loader, setLoader] = useState(false);
  const [enemyFullHealth] = useState<number | undefined>(enemy?.hp);
  const enemyHealth =
    enemy?.hp && enemyFullHealth ? enemy.hp / enemyFullHealth : undefined;

  // player store
  const character = useCharacterStore((state) => state.character);

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
                {character?.username ?? "You"}
                <span>AC : {character?.ac}</span>
                <span>
                  {Math.floor(
                    character?.hp
                      ? character.hp - character.damage_taken
                      : 10 - (character?.damage_taken ?? 0),
                  ) +
                    "/" +
                    character?.hp}
                </span>
              </div>
              <div className="w-[70%] mx-auto">
                <HitpointsBar />
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
          setSoundEffectAction={playSoundEffect}
        />
        {isInventoryOpened && (
          <InventoryCombatModal
            gameplay={gameplay}
            setSoundEffectAction={playSoundEffect}
          />
        )}
      </section>
    </>
  );
}
