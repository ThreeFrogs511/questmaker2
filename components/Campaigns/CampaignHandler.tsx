'use client'
import { useEffect, useRef, useState} from "react";
import { useUserContext } from "@/context/context";
import Engine from "@/classes/CampaignEngine";

// used to interpret HTML in JSON
import parse from "html-react-parser";

// main types
import { Nodes, Choice, Encounter } from "./NodeTypes";

// components and custom hooks
import PressPlayIcon from "./PressPlayIcon";
import Audio from "./Audio";
import CombatInterface from "./CombatInterface";

export default function CampaignHandler({
  currentNode, currentCampaign, setCurrentNodeAction, currentCampaignTitle} :
  {
    currentNode:keyof Nodes | undefined,
    setCurrentNodeAction:React.Dispatch<React.SetStateAction<keyof Nodes | undefined>>
    currentCampaign:Nodes | undefined,
    currentCampaignTitle: string | undefined
  }
) {

async function startNewCampaign(id:string) {
  const response = await fetch(`/api/campaigns/${id}`);
  const result = await response.json();
  return result;
}

    // global user state
    const {currentUser, setCurrentUser} = useUserContext();

    // store the currently available choices 
    const [allChoicesAvailable, setAllChoicesAvailable] = useState<Choice[]>();

    // display the ability check results onscreen
    const [abilityCheckData, setAbilityCheckData] = 
    useState<{status:boolean; value:number | null; success:boolean | null}>({status:false, value:null, success:null});
    
    // stores the user's past choices in the campaign
    const [userPastChoices, setUserPastChoices] = useState<Array<string>>([])

    // handles the on/off option for the voice over
    const [isPressed, setIsPressed] = useState(true);

    // prevents double clicking and errors
    const [keyboardPressed, setKeyboardPressed]= useState(false);


    // combat system requirements
    const [combatLog, setCombatLog] = useState<string |null>(null);
    const [enemyData, setEnemyData] = useState<Encounter | undefined>();
    const [isCombatOn, setIsCombatOn] = useState(false);

    
    // new instance for this campaign
    const gameplay = useRef<Engine>(new Engine(currentCampaign, currentNode, currentUser, setCurrentUser, setCombatLog, enemyData, setEnemyData));



  useEffect(() => {
    if (currentCampaign && currentNode) {
    gameplay.current.updateNode(currentNode)
    gameplay.current.prepareChoicesForPlayer(setAllChoicesAvailable, currentCampaign[currentNode].choices, userPastChoices);

    // activate the combat log when it's combat time
    if (currentCampaign[currentNode].choices) {
      const combatOn = currentCampaign[currentNode].choices.find(n => {
        if (n.combat_on) return n;
      });
      combatOn ? setIsCombatOn(true) : setIsCombatOn(false);
    }
    } 
  }, [currentCampaign, currentNode])


  // handle the keyboard navigation option
  useEffect(() => {
  function handleKeyboardSelection(e:any) {
      if (keyboardPressed) return;


        setKeyboardPressed(true);
        if (allChoicesAvailable && (e.key === "1" || e.key === '&')) {
          userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[0]?.text] ) : setUserPastChoices([allChoicesAvailable[0]?.text]);
          gameplay.current.determineNextNode(setCurrentNodeAction, allChoicesAvailable[0], setAbilityCheckData);
          setKeyboardPressed(false);

        } else if (allChoicesAvailable && (e.key === "2" || e.key ==="é")) {
            userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[1]?.text] ) : setUserPastChoices([allChoicesAvailable[1]?.text]);
            gameplay.current.determineNextNode(setCurrentNodeAction, allChoicesAvailable[1], setAbilityCheckData);
          setKeyboardPressed(false);

        } else if(allChoicesAvailable && (e.key === "3" || e.key==="\"")) {
            userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, allChoicesAvailable[2]?.text] ) : setUserPastChoices([allChoicesAvailable[2]?.text]);
            gameplay.current.determineNextNode(setCurrentNodeAction, allChoicesAvailable[2], setAbilityCheckData);
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

      {/* handles the audio */}

      <Audio 
      isPressed={isPressed} 
      setIsPressedAction={setIsPressed} 
      currentNode={currentNode} 
      currentCampaign={currentCampaign && currentCampaign}
      />

      {/* combat interface */}
        {isCombatOn && 
        <CombatInterface 
        combatLog={combatLog} 
        enemyData={enemyData} 
        gameplay={gameplay.current} 
        currentNode={currentNode} 
        setCurrentNodeAction={setCurrentNodeAction} />}
    
      {/* narration container*/}
        <div className="h-[55dvh] max-h-[55dvh] lg:h-[40dvh] lg:max-h-[40dvh] lg:mb-5!">

            {/* headers wrapper */}
            <div id="titleWrapper" className=" h-[20%] flex items-center overflow-hidden">
              <h1 
              className="text-lg! lg:text-4xl! font-bold font-minecraft text-amber-400">
                {currentCampaignTitle && currentCampaignTitle} 
              </h1>
              <PressPlayIcon isPressed={isPressed} setIsPressedAction={setIsPressed}/>
            </div>

            {/* content wrapper */}
            <div className="text-sm! h-[80%] max-h-[80%] lg:text-2xl! xl:mt-8! tracking-wide overflow-auto lg:overflow-hidden text-gray-200 leading-relaxed">
              <div className="text-justify mt-5!">
                {/* narration */}
                <div>{(currentNode && currentCampaign) && parse(currentCampaign[currentNode].text)}</div>

              </div>

              <p className={` font-semibold mt-5! ${abilityCheckData.success ? 'text-green-400' : 'text-red-600'}`}>
                {abilityCheckData.status ? 'YOU R0LL ' + abilityCheckData.value : '' }
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
                  userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, item.text] ) : setUserPastChoices([item.text]);
                  gameplay.current && gameplay.current.determineNextNode(setCurrentNodeAction, item, setAbilityCheckData);
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
    
  
