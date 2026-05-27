"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNarrationStore } from "@/stores/useNarrationStore";
import Engine from "@/classes/Engine";
import PreloadAudio from "../Audio/PreloadAudio";
// used to interpret HTML in JSON
import parse from "html-react-parser";
import Link from "next/link";

// main types

import { Choice, ChoiceResult } from "@/types/types";

// components and custom hooks
import DataVisualizer from "./DataVisualizer";
import PressPlayIcon from "../Audio/PressPlayIcon";
import Voices from "../Audio/Voices";
import CombatInterface from "../CombatComponents/CombatInterface";
import EndScreenInterface from "../EndScreen/EndScreenInterface";
import { useCombatStore } from "@/stores/useCombatStore";
import { useSound } from "use-sound";
import TypeWriter from "typewriter-effect";

export default function CampaignHandler() {
  //preloading the audio
  // const { voice, battleMusic } = PreloadAudio();

  // narration store
  const currentCampaign = useNarrationStore((state) => state.currentCampaign);
  const campaignTitle = useNarrationStore((state) => state.campaignTitle);
  const currentNode = useNarrationStore((state) => state.currentNode);

  // combat store
  const resetNbOfTurn = useCombatStore((state) => state.resetNbOfTurn);
  const soundEffect = useCombatStore((state) => state.soundEffect);


  // store the currently available choices
  const [allChoicesAvailable, setAllChoicesAvailable] = useState<Choice[]>();

  // state that displays the ability check results, penalties and other data onscreen
  const [choiceResult, setChoiceResult] = useState<ChoiceResult>({
    type: null,
    status: false,
    value: null,
    target: null,
    success: null,
  });

  // stores the user's past decisions
  const [userPastChoices, setUserPastChoices] = useState<Array<string>>([]);

  // stores the nodes' history
  const [userPastNodes, setUserPastNodes] = useState<Array<string>>([]);

  // handles the on/off option for the voice over
  const [isPressed, setIsPressed] = useState(true);

  // prevents double clicking on keyboard and errors
  const [keyboardPressed, setKeyboardPressed] = useState(false);

  // combat interface activation
  const [isCombatOn, setIsCombatOn] = useState(false);

  // end screen activation
  const [isCampaignOver, setIsCampaignOver] = useState(false);

  // lock the choices option to allow a small delay between each node for loading purposes
  const isLocked = useRef(false);

  // RUNNING THE MAIN ENGINE
  const gameplay = useRef<Engine | undefined>(undefined);
  if (!gameplay.current) {
    gameplay.current = new Engine(currentNode);
  };

  useEffect(() => {
    if (!gameplay.current) return;
    // launching background music at the start of the campaign
    gameplay.current.playMusic("backgroundMusic");

    //stopping all music when leaving the campaign
    return () => {
      gameplay.current?.stopAllMusic();
    }
  }, []);


  useEffect(() => {
    if (currentCampaign && currentNode && gameplay.current) {
      // manually updating the engine node

      gameplay.current.setNodeInsideEngine(currentNode);

      //cleaning and preparing the choices displayed to the player
      gameplay.current.prepareChoicesForPlayer(
        setAllChoicesAvailable,
        currentCampaign[currentNode].choices ?? [],
        userPastChoices,
      );

      // storing the nodes history, the story path
      setUserPastNodes((prev) =>
        prev.length > 0 ? [...prev, currentNode] : [currentNode],
      );

      // activating the combat interface when combat is on
      if (currentCampaign[currentNode].choices) {
        const combatOn = currentCampaign[currentNode].choices.find((n) => {
          if (n.combat_on) return n;
        });
        setIsCombatOn(combatOn ? true : false);
        
      }

      // activating the end screen when the campaign is over
      if (currentNode === "end_screen") {
        setIsCampaignOver(true);
      }
    }

    // locking choices for a few seconds when they appear
    // to avoid bugs due to button/click spamming
    isLocked.current = true;
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    }).then(() => (isLocked.current = false));
  }, [currentCampaign, currentNode, userPastChoices]);

  // handle the navigation by keyboard
  useEffect(() => {
    function handleKeyboardSelection(e: KeyboardEvent) {
      if (keyboardPressed || isLocked.current || !gameplay.current) return;

      setKeyboardPressed(true);
      if (allChoicesAvailable && (e.key === "1" || e.key === "&")) {
        if (!allChoicesAvailable[0]) return;
        //memorizing the user's choice for the narration and the gameplay consequences
        setUserPastChoices((prev) => [...prev, allChoicesAvailable[0]?.text]);

        //updating the engine
        gameplay.current.determineNextNode(
          allChoicesAvailable[0],
          setChoiceResult,
          userPastNodes,
          resetNbOfTurn,
        );

        setKeyboardPressed(false);
      } else if (allChoicesAvailable && (e.key === "2" || e.key === "é")) {
        if (!allChoicesAvailable[1]) return;

        setUserPastChoices((prev) => [...prev, allChoicesAvailable[1]?.text]);

        gameplay.current.determineNextNode(
          allChoicesAvailable[1],
          setChoiceResult,
          userPastNodes,
          resetNbOfTurn,
        );
        setKeyboardPressed(false);
      } else if (allChoicesAvailable && (e.key === "3" || e.key === '"')) {
        if (!allChoicesAvailable[2]) return;
        setUserPastChoices((prev) => [...prev, allChoicesAvailable[2]?.text]);

        gameplay.current.determineNextNode(
          allChoicesAvailable[2],
          setChoiceResult,
          userPastNodes,
          resetNbOfTurn,
        );
        setKeyboardPressed(false);
      } else {
        setKeyboardPressed(false);
        return;
      }
    }
    document.addEventListener("keydown", handleKeyboardSelection);
    return () =>
      document.removeEventListener("keydown", handleKeyboardSelection);
  }, [allChoicesAvailable, userPastNodes, resetNbOfTurn, keyboardPressed]);

  return (
    <>

      {isCombatOn && <CombatInterface gameplay={gameplay.current} />}

      {/* end screen component */}
      {isCampaignOver && <EndScreenInterface gameplay={gameplay.current} />}

      {/* narration container*/}
      <div className="h-[48dvh] lg:h-[40dvh] lg:mb-5!">
        {/* headers wrapper */}
        <div
          id="titleWrapper"
          className=" h-[20%] flex items-center overflow-hidden"
        >
          <h1 className="text-sm! lg:text-2xl! font-bold font-minecraft text-amber-400">
            {campaignTitle ? campaignTitle : "Campaign"}
          </h1>

          <div className="flex items-center h-full ml-10! gap-6!">
            {/* icon to mute or play the voices */}
            {/* <PressPlayIcon
              isPressed={isPressed}
              setIsPressedAction={setIsPressed}
            /> */}

            {/* leave campaign link */}
            <Link
              href="/launcher"
              className="flex items-center h-[50%] lg:h-[70%] text-xs! lg:text-sm! text-gray-400 hover:text-white border-2! border-gray-600 hover:border-white rounded px-2! transition-colors"
            >
              Leave
            </Link>
          </div>
        </div>

        {/* content wrapper */}
        <div className="text-sm! h-[80%] max-h-[80%] lg:text-base! lg:mt-5 tracking-wide overflow-auto lg:overflow-hidden text-gray-200 lg:leading-relaxed">
          <div className="text-justify mt-2!">
            {/* narration */}
            <div>
              {currentNode &&
                currentCampaign &&
                parse(currentCampaign[currentNode]?.text ?? "")}
            </div>
          </div>

          {/* displaying rolls or penalties value here */}
          <DataVisualizer choiceResult={choiceResult} />
        </div>
      </div>

      {/* Choices Container */}
      <div className="  h-[40dvh] max-h[40dvh] lg:h-[50dvh] lg:max-h-[50dvh] overflow-y-auto! p-2 lg:p-8 lg:mt-5 scrollingContainer ">
        <div className=" grid grid-cols-1">
          {allChoicesAvailable &&
            allChoicesAvailable.map((item, key) => {
              return (
                <button
                  key={key}
                  onPointerDown={() => {
                    if (isLocked.current) return;
                    setUserPastChoices((prev) => [...prev, item.text]);

                    if (gameplay.current) {
                      gameplay.current.determineNextNode(
                        item,
                        setChoiceResult,
                        userPastNodes,
                        resetNbOfTurn,
                      );
                    }
                  }}
                  className="hover:outline-2! border-2! my-1! border-white lg:border-0! outline-white! rounded-lg p-4! text-left"
                >
                  <div className="flex items-center grow">
                    <span className="text-amber-400 font-bold mr-3 lg:text-xl text-base">
                      {key + 1}.
                    </span>
                    <div>
                      <h3 className="text-white font-semibold mb-1 text-xs! md:text-base!">
                        {parse(item.text)}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}
