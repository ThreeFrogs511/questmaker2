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
import CombatLog from "./CombatLog";

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
      // console.log(currentNode)
    gameplay.current.updateNode(currentNode)
    gameplay.current.prepareChoicesForPlayer(setAllChoicesAvailable, currentCampaign[currentNode].choices, userPastChoices);

    // activate the combat log
    if (currentCampaign[currentNode].choices) {
      const combatOn = currentCampaign[currentNode].choices.find(n => {
        if (n.combat_on) return n;
      });
      combatOn ? setIsCombatOn(true) : setIsCombatOn(false);
    }
    } 
  }, [currentCampaign, currentNode])




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
    <section className="grid grid-rows-4 w-full h-dvh  gap-10! font-minecraft lg:p-10">

      {/* handles the audio */}

      <Audio 
      isPressed={isPressed} 
      setIsPressedAction={setIsPressed} 
      currentNode={currentNode} 
      currentCampaign={currentCampaign && currentCampaign}
      />

      {/* <Bar /> */}
    
      {/* narration container*/}
        <div className="row-start-1! row-end-3!">

            {/* headers wrapper */}
            <div id="titleWrapper" className="  h-[20%] flex items-center overflow-hidden lg:mb-10!">
              <h1 
              className="text-lg! lg:text-4xl! font-bold text-amber-400">
                {currentCampaignTitle && currentCampaignTitle} 
              </h1>
              <PressPlayIcon isPressed={isPressed} setIsPressedAction={setIsPressed}/>
            </div>

            {/* content wrapper */}
            <div className="text-sm!  lg:text-xl! tracking-widest max-h-[40dvh]  h-full overflow-auto lg:overflow-hidden text-gray-200 leading-relaxed">
              <div className="text-justify">
                {/* narration */}
                {(currentNode && currentCampaign) && parse(currentCampaign[currentNode].text)}

                {/* combat log */}
                {isCombatOn && <CombatLog combatLog={combatLog} enemyData={enemyData} />}
              </div>

              <p className={` font-semibold mt-5! ${abilityCheckData.success ? 'text-green-400' : 'text-red-600'}`}>
                {abilityCheckData.status ? 'YOU R0LL ' + abilityCheckData.value : '' }
              </p>
            </div>

        </div>
        
        {/* Choices Container */}
            <div className=" row-span-2 overflow-y-auto! p-2 lg:p-8 h-full ">

              <div className=" grid grid-cols-1 mt-5 ">
                {allChoicesAvailable && allChoicesAvailable.map((item, key) => { 
                  return <button 
                  key={key}
                  onPointerDown={ () => { 
                  userPastChoices.length>0 ? setUserPastChoices((prev) => [...prev, item.text] ) : setUserPastChoices([item.text]);
                  gameplay.current && gameplay.current.determineNextNode(setCurrentNodeAction, item, setAbilityCheckData);
                  }}
                  className="hover:outline-4! border-4! my-2! border-white lg:border-0! outline-white! rounded-lg p-4 text-left">
                  <div className="flex items-start grow">
                    <span className="text-amber-400 font-bold mr-3 text-xl">{key+1}.</span>
                    <div>
                      <h3 className="text-white font-semibold mb-1 lg:text-xl!">{parse(item.text)}</h3>
                    </div>
                  </div>
                </button>
              })}
              </div>

            </div>    


    </section>

  )
          
}
    
  
