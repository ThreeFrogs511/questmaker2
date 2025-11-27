'use client'
import { useEffect, useState} from "react";
import { useUserContext } from "@/context/context";
import campaign from '@/assets/campaignIntro.json'
import Campaign from "@/classes/Campaign";
import useSound from "use-sound";

export default function DndCampaign() {


const {currentUser, setCurrentUser, isFetchingDone} = useUserContext();

// describe the 'nodes' global object
type Nodes = Record<string, Node>;

// describe the type of each node
type Node = {
  text: string;
  choices?: Choice[];                 
  effects?: Record<string, unknown>;
  type?: string;                     
  condition?: string;
  true?: string;
  false?: string;
  fail?: string;
};

// describe the type fo the array choice of each node
type Choice = {
  text: string;
  check?:string;
  next?: string;
  type?: "check" | "combat" | "redirect_condition";
  stat?: string;
  dc?: number;
  success?: string;
  fail?: string;
  win?: string;
  lose?: string;
  enemyHp?: number;
  enemyDmg?: number;
  effects?: Record<string, unknown>;
  action?: string;
  penalty?:{ability:string, value:number};
};

    // current campaign
    const currentCampaign = campaign[0].nodes as Nodes;

    // current node aka current scene
    const [currentNode, setCurrentNode] = useState<keyof Nodes | undefined>("intro_beach");

    // allows to edit the choices real time
    // in order to insert user's info like name or race
    const [allChoices, setAllChoices] = useState<Choice[]>();
    

    // display the ability check results onscreen
    const [abilityCheckData, setAbilityCheckData] = 
    useState<{status:boolean; value:number | null; success:boolean | null}>({status:false, value:null, success:null});
    
    // stores the user's past choices in the campaign
    const [userChoices, setUserChoices] = useState<Array<string | undefined>>([])

    const [isVoicePlaying, setIsVoicePlaying] = useState(false);

    function playVoices() {
      if (!isVoicePlaying) {
        voice();
        // stop();
      } else {
        stop();
      }
      setIsVoicePlaying(prev => !prev);

    }
    
    const [voice, {stop}] = useSound(`/voices/${currentNode}.mp3`);

    // create a new Campaign Class each time currentNode changes
    // display the user's info in the narration text and stores their past choices
    useEffect(() => {
      if (currentNode) {
        !allChoices && setAllChoices(currentCampaign[currentNode].choices);
        stop();
        setIsVoicePlaying( false);
        // voice();

        const node = new Campaign(currentNode, currentCampaign,currentUser)
        node.displayDynamicInfo(setAllChoices);
        userChoices ? node.storingUserChoices(userChoices, setUserChoices) : setUserChoices([currentNode]);
      }
    }, [currentNode])




  return (
    <section className="flex flex-col justify-center w-full h-dvh font-minecraft lg:p-10">

      {/* narration container*/}
        <div className=" p-4 lg:p-8  border-b-2!" >
            <h1 className="text-lg! lg:text-4xl! font-bold text-amber-400 mb-4">{campaign[0].meta.title} 
              <span className="ml-5 cursor-pointer" onPointerDown={() => playVoices()}>SON</span>
            </h1>
            <div className="text-base! lg:text-2xl! tracking-widest max-h-[40dvh] overflow-auto text-gray-200 leading-relaxed">
              {currentNode && currentCampaign[currentNode].text}
              <p className={` font-semibold mt-5! ${abilityCheckData.success ? 'text-green-400' : 'text-red-600'}`}>
                {abilityCheckData.status ? 'YOU R0LL ' + abilityCheckData.value : '' }
              </p>
            </div>
        </div>
        
        {/* Choices Container */}
        <div className="overflow-y-auto! p-2 lg:p-8 h-full ">
            <div className=" grid grid-cols-1 mt-5 ">
            {allChoices && allChoices.map((item, key) => { 

              // if the user failed a choice, he can't do it again
              if (userChoices?.includes(item.fail)) return null;

                return <button 
                key={key}
                onPointerDown={() => { 
                  new Campaign(currentNode, currentCampaign,currentUser)
                  .handleChoicesOptions(setCurrentNode, setAbilityCheckData, item.check, item.next);
                }}
                className="hover:outline-4! border-4! my-2! border-white lg:border-0! outline-white! rounded-lg p-4 text-left">
                    <div className="flex items-start grow">
                        <span className="text-amber-400 font-bold mr-3 text-xl">{key+1}.</span>
                        <div>
                        <h3 className="text-white font-semibold mb-1 lg:text-xl!">{item.text}</h3>
                        </div>
                    </div>
                </button>
            })}
        
            </div>
        </div>
    </section>
  );
}