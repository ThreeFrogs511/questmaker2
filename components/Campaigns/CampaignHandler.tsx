'use client'
import { useEffect, useState} from "react";
import { useUserContext } from "@/context/context";
import campaign from '@/assets/campaignIntro.json'
import Campaign from "@/classes/Campaign";

// used to interpret HTML in JSON
import parse from "html-react-parser";


// main types
import { Nodes, Choice } from "./NodeTypes";

// components and custom hooks
import PressPlayIcon from "./PressPlayIcon";
import Audio from "./Audio";


export default function CampaignHandler() {

    // global user state
    const {currentUser} = useUserContext();

    // current campaign
    const currentCampaign = campaign[0].nodes as Nodes;

    // current node aka current scene
    const [currentNode, setCurrentNode] = useState<keyof Nodes | undefined>();

    // store the currently available choices 
    const [allChoicesAvailable, setAllChoicesAvailable] = useState<Choice[]>();

    // display the ability check results onscreen
    const [abilityCheckData, setAbilityCheckData] = 
    useState<{status:boolean; value:number | null; success:boolean | null}>({status:false, value:null, success:null});
    
    // stores the user's past choices in the campaign
    const [userPastChoices, setUserPastChoices] = useState<Array<string>>([])

    // handles the on/off option for the voice over
    const [isPressed, setIsPressed] = useState(true);

    const [keyboardPressed, setKeyboardPressed]= useState(false);


    // create a new Campaign Class each time currentNode changes
    useEffect(() => {
      if (currentNode) {
        // change the [PLACEHOLDERS] by the user's info in the choices
        // and filter choices already made
        const node = new Campaign(currentNode, currentCampaign,currentUser)
        node.filterTheChoices(setAllChoicesAvailable, currentCampaign[currentNode].choices, userPastChoices);

  
      }
    }, [currentNode])


    // launching the first node
    useEffect(() => {
      const firstNode = Object.keys(currentCampaign)[0];
      setCurrentNode(firstNode);
  }, []);

  function pickChoiceWithKeyboard(e:any) {
    if (allChoicesAvailable) {
      if (keyboardPressed) return;

        setKeyboardPressed(true);
        if (e.key === "1" || e.key === '&') {
          new Campaign(currentNode, currentCampaign,currentUser)
          .handleChoicesResult(setCurrentNode, setAbilityCheckData, allChoicesAvailable[0]?.check, allChoicesAvailable[0]?.next);
          setKeyboardPressed(false);
        } else if (e.key === "2" || e.key ==="é") {
            new Campaign(currentNode, currentCampaign,currentUser)
          .handleChoicesResult(setCurrentNode, setAbilityCheckData, allChoicesAvailable[1]?.check, allChoicesAvailable[1]?.next);
          setKeyboardPressed(false);
        } else if(e.key === "3" || e.key==="\"") {
          new Campaign(currentNode, currentCampaign,currentUser)
          .handleChoicesResult(setCurrentNode, setAbilityCheckData, allChoicesAvailable[2]?.check, allChoicesAvailable[2]?.next);
          setKeyboardPressed(false);
        } else {
          setKeyboardPressed(false);
          return;
        }
    }
  }

  useEffect(() => {
  document.addEventListener('keydown', pickChoiceWithKeyboard);

  return () => { 
    document.removeEventListener('keydown', pickChoiceWithKeyboard)
    console.log("event unmounted")}
    
  }, [allChoicesAvailable])


  return (
    
    <section className="grid grid-rows-4 w-full h-dvh  gap-10! font-minecraft lg:p-10">

      {/* handles the audio */}
      <Audio 
      isPressed={isPressed} 
      setIsPressedAction={setIsPressed} 
      currentNode={currentNode} 
      currentCampaign={currentCampaign}
      />

      {/* narration container*/}
        <div className="row-start-1! row-end-3!">

            {/* headers wrapper */}
            <div id="titleWrapper" className="  h-[20%] flex items-center overflow-hidden lg:mb-10!">
              <h1 
              className="text-lg! lg:text-4xl! font-bold text-amber-400">
                {campaign[0].meta.title} 
              </h1>
              <PressPlayIcon isPressed={isPressed} setIsPressedAction={setIsPressed}/>
            </div>

            {/* narration text wrapper */}
            <div className="text-sm!  lg:text-xl! tracking-widest max-h-[40dvh]  h-full overflow-auto lg:overflow-hidden text-gray-200 leading-relaxed">
              <p className="text-justify">{currentNode && parse(currentCampaign[currentNode].text)}</p>
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
                 
                  new Campaign(currentNode, currentCampaign,currentUser)
                  .handleChoicesResult(setCurrentNode, setAbilityCheckData, item.check, item.next);
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

    
  );
}