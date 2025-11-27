// describe the 'nodes' global object
export type Nodes = Record<string, Node>;

// describe the type of each node
export type Node = {
text: string;
choices?: Choice[];                 
effects?: Record<string, unknown>;
type?: string;                     
condition?: string;
true?: string;
false?: string;
fail?: string;
};

// describe the type for the array choice of each node
export type Choice = {
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

// describe the type for the currentUser global state
export type User = {
id: number | null,
username: string | null,
email: string | null,
hp: number | null,
xp: number | null,
dopamine: number | null,
dopamine_consumed:number | null,
gender: string | null
user_class : string | null,
race: string | null,
lvl : number | null,
str : number | null,
dex : number | null,
con : number | null,
int : number | null,
wis : number | null,
cha : number | null,
profile_completed : boolean,
damage_taken: number
}

export default class Campaign {

    private node;
    private campaign;
    private currentUser;


    constructor(node:keyof Nodes | undefined, campaign:Nodes, currentUser: User) {
        this.node = node;
        this.campaign=campaign;
        this.currentUser=currentUser;
    }


    displayDynamicInfo(setAllChoices:any) {
        if (this.node) {
            let allChoices= this.campaign[this.node].choices;
            if (allChoices) {
              const dynamicChoices = allChoices.map((n => {
                if (n.text.includes('[USERNAME]')) {
                  n.text = n.text.replace('[USERNAME]', `${this.currentUser.username ?? ''}`)
                  return n;
                } else if (n.text.includes('[RACE]')) {
                    n.text = n.text.replace('[RACE]', `${this.currentUser.race ?? ''}`)
                    return n;
                } else {
                  return n;
                }
              }))
              setAllChoices(dynamicChoices);
            }    
    }}

    handleChoicesOptions(setCurrentNode:any, setAbilityCheckData:any, check:string | undefined, next:string | undefined) {
      // is there an ability check ?
      if (check && this.node) {
        let currentNode = this.campaign[this.node];
        // a choice exists ?
        if (currentNode.choices) {
          
          // we explore the array 'choice'
          for (let i=0 ; i < currentNode.choices?.length; i++) {

            // there is an ability check ?
            if (currentNode.choices[i].check === check) {

              // we store the value of the ability check
              const dc = currentNode.choices[i].dc;

              if (check && dc) {
                // we pull out the corresponding ability in the current user data
                const userStat: any = Object.entries(this.currentUser).find(n => n.includes(check));
                const modifier = Math.floor((userStat[1]-10)/2);
                const abilityScore = Math.floor(Math.random() * 20)+1+modifier;

                if (abilityScore<dc) {
                  currentNode.choices[i].fail && setCurrentNode(currentNode.choices[i].fail);
                  setAbilityCheckData((prev: any) => ({...prev, success:false, value:abilityScore, status:true}));
                } else {
                  setCurrentNode(currentNode.choices[i].next);
                  setAbilityCheckData((prev: any) => ({...prev, success:true, value:abilityScore, status:true}));
                }
              }
            }
          }
        }
      
      // no checks ? We move to the next node and reset the ability check state
      } else {
        next && setCurrentNode(next);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
    
    }

    storingUserChoices(userChoices:Array<string | undefined>, setUserChoices:React.Dispatch<React.SetStateAction<Array<string | undefined>>>) {
      const choices = userChoices && [...userChoices];
      choices?.push(this.node);
      choices ? setUserChoices(choices) : setUserChoices([this.node]);
    }
}



    // // replaces placeholders [PLACEHOLDER] in the JSON file by the user's info dynamically
    // function displayDynamicInfo(currentNode:keyof Nodes) {
    //     if (currentCampaign[currentNode].text.includes('[USERNAME]')) {
    //       currentCampaign[currentNode].text = currentCampaign[currentNode].text.replace('[USERNAME]', `${currentUser.username ?? ''}`)
    //       setDisplayedText(currentCampaign[currentNode].text);
    //     } else if (currentCampaign[currentNode].text.includes('[RACE]')) {
    //       currentCampaign[currentNode].text = currentCampaign[currentNode].text.replace('[RACE]', `${currentUser.race ?? ''}`)
    //       setDisplayedText(currentCampaign[currentNode].text);
    //     } else {
    //       setDisplayedText(currentCampaign[currentNode].text);
    //     }      
    // }

    // function handleChoicesOptions(currentNode:keyof Nodes, check:string | undefined, next:string | undefined) {
    //   // is there an ability check ?
    //   if (check) {

    //     // a choice exists ?
    //     if (currentCampaign[currentNode].choices) {
          
    //       // we explore the array 'choice'
    //       for (let i=0 ; i < currentCampaign[currentNode].choices?.length; i++) {

    //         // there is an ability check ?
    //         if (currentCampaign[currentNode].choices[i].check === check) {

    //           // we store the value of the ability check
    //           const dc = currentCampaign[currentNode].choices[i].dc;

    //           if (check && dc) {
    //             // we pull out the corresponding ability in the current user data
    //             const userStat: any = Object.entries(currentUser).find(n => n.includes(check));
    //             const modifier = Math.floor((userStat[1]-10)/2);
    //             const abilityScore = Math.floor(Math.random() * 20)+1+modifier;

    //             if (abilityScore<dc) {
    //               currentCampaign[currentNode].choices[i].fail && setCurrentNode(currentCampaign[currentNode].choices[i].fail);
    //               setAbilityCheckData(prev => ({...prev, success:false, value:abilityScore, status:true}));
    //             } else {
    //               setCurrentNode(currentCampaign[currentNode].choices[i].next);
    //               setAbilityCheckData(prev => ({...prev, success:true, value:abilityScore, status:true}));
    //             }
    //           }
    //         }
    //       }
    //     }
      
    //   // no checks ? We move to the next node and reset the ability check state
    //   } else {
    //     next && setCurrentNode(next);
    //     setAbilityCheckData(prev => ({...prev, success:null, value:null, status:false}));
    //   }
    
    // }
      
    // function storingUserChoices() {
    //   const choices = userChoices && [...userChoices];
    //   choices?.push(currentNode);
    //   choices ? setUserChoices(choices) : setUserChoices([currentNode]);
    // }