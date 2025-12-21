'use client'
import { useEffect, useRef, useState} from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useNarrationStore} from "@/stores/useNarrationStore";
import Engine from "@/classes/CampaignEngine";
import useSound from "use-sound";
import PreloadAudio from "./PreloadAudio";
// used to interpret HTML in JSON
import parse from "html-react-parser";

// main types

import {Nodes, Choice, Encounter} from '@/types/types'

// components and custom hooks
import PressPlayIcon from "./PressPlayIcon";
import Voices from "./Voices";
import CombatInterface from "./CombatComponents/CombatInterface";
import Music from "./CombatComponents/Music";
import { useCombatStore } from "@/stores/useCombatStore";

export default function CampaignHandler() {

    const { voice, battleMusic } = PreloadAudio();
    // user store
    const currentUser = useUserStore(state => state.currentUser);
    const updateStats = useUserStore(state => state.updateStats);
   

    // narration store
    const currentCampaign = useNarrationStore(state => state.currentCampaign);
    const campaignTitle = useNarrationStore(state => state.campaignTitle);
    const currentNode = useNarrationStore(state => state.currentNode);
    const updateNode = useNarrationStore(state => state.updateNode);
  
    // combat store
    const setCombatLog = useCombatStore(state => state.setCombatLog);
    const clearCombatLog = useCombatStore(state => state.clearCombatLog);
    const updateEnemy = useCombatStore(state => state.updateEnemy);

    // store the currently available choices 
    const [allChoicesAvailable, setAllChoicesAvailable] = useState<Choice[]>();

    // display the ability check results onscreen
    const [abilityCheckData, setAbilityCheckData] = 
    useState<{status:boolean; value:number | null; success:boolean | null}>({status:false, value:null, success:null});
    
    // stores the user's past options choices in the campaign to prevent double-dipping
    const [userPastChoices, setUserPastChoices] = useState<Array<string>>([])

    // handles the story paths by storing the current nodes
    // used to unlock exclusive path based on user's past choices
    // FYI : userPastChoices stores the choices options while userPastNodes the nodes
    const [userPastNodes, setUserPastNodes] = useState<Array<string>>([]);

    // handles the on/off option for the voice over
    const [isPressed, setIsPressed] = useState(true);

    // prevents double clicking on keyboard and errors
    const [keyboardPressed, setKeyboardPressed]= useState(false);

    // combat system requirements
    const [isCombatOn, setIsCombatOn] = useState(false);

    // lock the choices option to allow a small delay between each node for loading purposes
    const isLocked = useRef(false);

    
    // new instance for this campaign
    const gameplay = useRef<Engine>(new Engine( 
      currentNode, 
      currentUser, 
      updateStats, 
      setCombatLog, 
      clearCombatLog, 
      updateEnemy));



  useEffect(() => {
    if (currentCampaign && currentNode) {

      // manually updating the engine node
      gameplay.current.updateNode(currentNode)

      //cleaning and preparing the choices displayed to the player
      gameplay.current.prepareChoicesForPlayer(setAllChoicesAvailable, currentCampaign[currentNode].choices, userPastChoices);
  
      // storing the past nodes  for story purposes
      userPastNodes.length>0 ? setUserPastNodes((prev) => [...prev, currentNode] ) : setUserPastNodes([currentNode]);

      // activating the combat interface when it's combat time
      if (currentCampaign[currentNode].choices) {
        const combatOn = currentCampaign[currentNode].choices.find(n => {
          if (n.combat_on) return n;
        });
        if (combatOn){ 
          setIsCombatOn(true)
        } else {
          setIsCombatOn(false);
        }
      }
    } 

    // locking choices for a few seconds when they appear to avoid bugs due to spamming 
    isLocked.current=true;
    new Promise<void>(resolve => {setTimeout(() => {resolve()}, 500)})
    .then(() => isLocked.current=false)

  }, [currentCampaign, currentNode])


  // handle the keyboard navigation option
  useEffect(() => {
    function handleKeyboardSelection(e:any) {
        if (keyboardPressed || isLocked.current) return;


          setKeyboardPressed(true);
          if (allChoicesAvailable && (e.key === "1" || e.key === '&')) {
            if (!allChoicesAvailable[0]) return;
            userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[0]?.text] ) : setUserPastChoices([allChoicesAvailable[0]?.text]);
            gameplay.current.determineNextNode(updateNode, allChoicesAvailable[0], setAbilityCheckData, userPastNodes);
            setKeyboardPressed(false);

          } else if (allChoicesAvailable && (e.key === "2" || e.key ==="é")) {
              if (!allChoicesAvailable[1]) return;
              userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[1]?.text] ) : setUserPastChoices([allChoicesAvailable[1]?.text]);
              gameplay.current.determineNextNode(updateNode, allChoicesAvailable[1], setAbilityCheckData, userPastNodes);
            setKeyboardPressed(false);

          } else if(allChoicesAvailable && (e.key === "3" || e.key==="\"")) {
              if (!allChoicesAvailable[2]) return;
              userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[2]?.text] ) : setUserPastChoices([allChoicesAvailable[2]?.text]);
              gameplay.current.determineNextNode(updateNode, allChoicesAvailable[2], setAbilityCheckData, userPastNodes);
              setKeyboardPressed(false);
          } else {
            setKeyboardPressed(false);
            return;
          }
    }
    document.addEventListener('keydown', handleKeyboardSelection);
    return () => document.removeEventListener('keydown', handleKeyboardSelection);
  }, [allChoicesAvailable])

  //if the user's stats changed during the campaign, we also need to
  //manually update the state in the engine as it doesn't
  //act as a normal state but as an fixed attribute
  useEffect(()=> {
    console.log( currentUser.damage_taken)
    gameplay.current.updateUser(currentUser)
  },[currentUser])

 return (
    <section className=" w-full h-dvh max-h-full gap-10! lg:p-10">

      {/* handles the story audio */}
      <Voices play={voice.play} stop={voice.stop} isPressed={isPressed} />

      {/* combat interface and music */}
      {isCombatOn && <Music play={battleMusic.play} stop={battleMusic.stop}/> }
      {isCombatOn && <CombatInterface gameplay={gameplay.current} />}
    
      {/* narration container*/}
        <div className="h-[50dvh] max-h-[50dvh] lg:h-[40dvh] lg:max-h-[40dvh] lg:mb-5!">

            {/* headers wrapper */}
            <div id="titleWrapper" className=" h-[20%] flex items-center overflow-hidden">
              <h1 
              className="text-lg! lg:text-4xl! font-bold font-minecraft text-amber-400">
                {campaignTitle ? campaignTitle : 'Campagne'} 
              </h1>

              <PressPlayIcon isPressed={isPressed} setIsPressedAction={setIsPressed}/>

            </div>

            {/* content wrapper */}
            <div className="text-sm! h-[80%] max-h-[80%] lg:text-2xl! xl:mt-8! tracking-wide overflow-auto lg:overflow-hidden text-gray-200 lg:leading-relaxed">
              <div className="text-justify mt-2! lg:mt-5!">

                {/* narration */}
                <div>{(currentNode && currentCampaign) && parse(currentCampaign[currentNode].text ?? '')}</div>

              </div>

              <p className={` font-semibold mt-5! ${abilityCheckData.success ? 'text-green-400' : 'text-red-600'}`}>
                {abilityCheckData.status ? 'YOU ROLL ' + abilityCheckData.value : '' }
              </p>

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
                  gameplay.current && gameplay.current.determineNextNode(updateNode, item, setAbilityCheckData, userPastNodes);
                  }}
                  className="hover:outline-2! border-2! my-1! border-white lg:border-0! outline-white! rounded-lg p-4! text-left">
                  <div className="flex items-center grow">
                    <span className="text-amber-400 font-bold mr-3 text-xl">{key+1}.</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1 text-xs! lg:text-xl!">{parse(item.text)}</h3>
                    </div>
                  </div>
                </button>
              })}
              </div>

            </div>    


    </section>

  )
          
}
    
  
