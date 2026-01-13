'use client'
import { useEffect, useRef, useState} from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useNarrationStore} from "@/stores/useNarrationStore";
import Engine from "@/classes/Engine";
import PreloadAudio from "../Audio/PreloadAudio";
// used to interpret HTML in JSON
import parse from "html-react-parser";

// main types

import {Choice, Data} from '@/types/types'

// components and custom hooks
import DataVisualizer from "./DataVisualizer";
import PressPlayIcon from "../Audio/PressPlayIcon";
import Voices from "../Audio/Voices";
import CombatInterface from "../CombatComponents/CombatInterface";
import BattleMusic from "../Audio/BattleMusic";
import EndScreenInterface from "../EndScreen/EndScreenInterface";
import { useCombatStore } from "@/stores/useCombatStore";

export default function CampaignHandler() {

  //preloading the audio
  const { voice, battleMusic } = PreloadAudio();


  // user store
  const currentUser = useUserStore(state => state.currentUser);
  
  // narration store
  const currentCampaign = useNarrationStore(state => state.currentCampaign);
  const campaignTitle = useNarrationStore(state => state.campaignTitle);
  const currentNode = useNarrationStore(state => state.currentNode);

  // combat store
  const setCombatLog = useCombatStore(state => state.setCombatLog);
  const clearCombatLog = useCombatStore(state => state.clearCombatLog);
  const resetNbOfTurn = useCombatStore(state => state.resetNbOfTurn);

  // store the currently available choices 
  const [allChoicesAvailable, setAllChoicesAvailable] = useState<Choice[]>();

  // state that displays the ability check results, penalties and other data onscreen
  const [data, setData] = useState<Data>({type:null, status:false, value:null, target:null, success:null});
  
  // stores the user's past decisions
  const [userPastChoices, setUserPastChoices] = useState<Array<string>>([])

  // stores the nodes' history
  const [userPastNodes, setUserPastNodes] = useState<Array<string>>([]);

  // handles the on/off option for the voice over
  const [isPressed, setIsPressed] = useState(true);

  // prevents double clicking on keyboard and errors
  const [keyboardPressed, setKeyboardPressed]= useState(false);

  // combat interface activation
  const [isCombatOn, setIsCombatOn] = useState(false);

  // end screen activation
  const [isCampaignOver, setIsCampaignOver] = useState(false);

  // lock the choices option to allow a small delay between each node for loading purposes
  const isLocked = useRef(false);

  
  // RUNNING THE MAIN ENGINE
  const gameplay = useRef<Engine>(new Engine(currentNode));



  useEffect(() => {
    if (currentCampaign && currentNode) {

      // manually updating the engine node
      gameplay.current.setNodeInsideEngine(currentNode)

      //cleaning and preparing the choices displayed to the player
      gameplay.current.prepareChoicesForPlayer(setAllChoicesAvailable, currentCampaign[currentNode].choices, userPastChoices);
  
      // storing the nodes history, the story path
      userPastNodes.length>0 ? setUserPastNodes((prev) => [...prev, currentNode] ) : setUserPastNodes([currentNode]);

      // activating the combat interface when combat is on
      if (currentCampaign[currentNode].choices) {
        const combatOn = currentCampaign[currentNode].choices.find(n => {if (n.combat_on) return n});
        combatOn ? setIsCombatOn(true) : setIsCombatOn(false);
      }

      // activating the end screen when the campaign is over
      if (currentNode === "end_screen") {
        setIsCampaignOver(true);
      }
    } 

    // locking choices for a few seconds when they appear to avoid bugs due to button/click spamming 
    isLocked.current=true;
    new Promise<void>(resolve => {setTimeout(() => {resolve()}, 500)})
    .then(() => isLocked.current=false)

  }, [currentCampaign, currentNode])


  // handle the navigation by keyboard
  useEffect(() => {
    function handleKeyboardSelection(e:any) {
        if (keyboardPressed || isLocked.current) return;


          setKeyboardPressed(true);
          if (allChoicesAvailable && (e.key === "1" || e.key === '&')) {
            if (!allChoicesAvailable[0]) return;
            userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[0]?.text] ) : setUserPastChoices([allChoicesAvailable[0]?.text]);
            gameplay.current.determineNextNode(allChoicesAvailable[0], setData, userPastNodes, resetNbOfTurn);
            setKeyboardPressed(false);

          } else if (allChoicesAvailable && (e.key === "2" || e.key ==="é")) {
              if (!allChoicesAvailable[1]) return;
              userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[1]?.text] ) : setUserPastChoices([allChoicesAvailable[1]?.text]);
              gameplay.current.determineNextNode(allChoicesAvailable[1], setData, userPastNodes, resetNbOfTurn);
            setKeyboardPressed(false);

          } else if(allChoicesAvailable && (e.key === "3" || e.key==="\"")) {
              if (!allChoicesAvailable[2]) return;
              userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[2]?.text] ) : setUserPastChoices([allChoicesAvailable[2]?.text]);
              gameplay.current.determineNextNode(allChoicesAvailable[2], setData, userPastNodes, resetNbOfTurn);
              setKeyboardPressed(false);
          } else {
            setKeyboardPressed(false);
            return;
          }
    }
    document.addEventListener('keydown', handleKeyboardSelection);
    return () => document.removeEventListener('keydown', handleKeyboardSelection);
  }, [allChoicesAvailable])


 return (
    <section className=" w-full h-dvh max-h-full gap-10! lg:p-10">

      {/* handles the story audio */}
      <Voices play={voice.play} stop={voice.stop} isPressed={isPressed} />

      {/* combat interface and music */}
      {isCombatOn && <BattleMusic play={battleMusic.play} stop={battleMusic.stop}/> }
      {isCombatOn && <CombatInterface gameplay={gameplay.current} />}

      {/* end screen component */}
      {isCampaignOver && <EndScreenInterface gameplay={gameplay.current}/>}
    
      {/* narration container*/}
        <div className="h-[48dvh] lg:h-[40dvh] lg:mb-5!">

            {/* headers wrapper */}
            <div id="titleWrapper" className=" h-[20%] flex items-center overflow-hidden">
              <h1 
              className="text-lg! lg:text-2xl! font-bold font-minecraft text-amber-400">
                {campaignTitle ? campaignTitle : 'Campaign'} 
              </h1>

              {/* icon to mute or play the voices */}
              <PressPlayIcon isPressed={isPressed} setIsPressedAction={setIsPressed}/>

            </div>

            {/* content wrapper */}
            <div className="text-sm! h-[80%] max-h-[80%] lg:text-xl! lg:mt-5 tracking-wide overflow-auto lg:overflow-hidden text-gray-200 lg:leading-relaxed">
              <div className="text-justify mt-2!">

                {/* narration */}
                <div>{(currentNode && currentCampaign) && parse(currentCampaign[currentNode].text ?? '')}</div>

              </div>

              {/* displaying rolls or penalties value here */}
              <DataVisualizer data={data} />
            </div>

        </div>
        
        {/* Choices Container */}
            <div className="  h-[40dvh] max-h[40dvh] lg:h-[50dvh] lg:max-h-[50dvh] overflow-y-auto! p-2 lg:p-8 lg:mt-5  ">

              <div className=" grid grid-cols-1">
                {allChoicesAvailable && allChoicesAvailable.map((item, key) => { 
                  return <button 
                  key={key}
                  onPointerDown={ () => { 
                  if(isLocked.current) return;
                  userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, item.text] ) : setUserPastChoices([item.text]);
                  gameplay.current && gameplay.current.determineNextNode(item, setData, userPastNodes, resetNbOfTurn);
                  }}
                  className="hover:outline-2! border-2! my-1! border-white lg:border-0! outline-white! rounded-lg p-4! text-left">
                  <div className="flex items-center grow">
                    <span className="text-amber-400 font-bold mr-3 lg:text-xl text-base">{key+1}.</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1 text-sm! lg:text-xl!">{parse(item.text)}</h3>
                    </div>
                  </div>
                </button>
              })}
              </div>

            </div>    
      


    </section>



  )
          
}
    
  
