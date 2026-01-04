import { useUserStore } from "@/stores/useUserStore";
import {Choice} from '@/types/types'

export default class ExclusivePaths {

    private nextNodeAlt:string | null;

    constructor() {
        this.nextNodeAlt = null;
    }

    handler(currentChoice:Choice, setCurrentNode:any) {

        // setting up
        const currentUser = useUserStore.getState().currentUser;
        const nextNode = currentChoice.next;
        const userRace = currentUser.race;
        const userGender = currentUser.gender;
        const userClass = currentUser.user_class;
        // fetching the "alt" array
        const alt = currentChoice.alt
        
        if (alt) {

            // exploring the alt array and testing each value
            for (let i = 0 ; i <= alt.length ; i++) {

                // if the user's race or gender is not concerned
                // we simply move to the standard next node
                if (i === alt.length && !this.nextNodeAlt) {
                    setCurrentNode(nextNode); 
                    break;
                }

                switch(alt[i].type) {
                    case "race": 
                    this.handlingRacePaths(alt[i].value, setCurrentNode, userRace ?? '', currentChoice);
                    break;

                    case "gender":
                    this.handlingGenderPaths(alt[i].value, setCurrentNode, userGender ?? '', currentChoice);
                    break;

                    case"class":
                    this.handlingClassPaths(alt[i].value, setCurrentNode, userClass ?? '', currentChoice);
                    break;

                }
              
                // because there's only one instance of the mother class "Engine"
                // we need to reset this attribute in order to reuse it later
                // else it'll keep the old value
                if (this.nextNodeAlt) {
                    this.nextNodeAlt=null;
                    break;
                };

                
            }
          
        }
    
    }

    handlingRacePaths(value:string, setCurrentNode:any, race:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === race.toLowerCase()) {
            this.nextNodeAlt = `${nextNode}_${value}`;
            setCurrentNode(this.nextNodeAlt);
        }
    };
    handlingGenderPaths(value:string, setCurrentNode:any, gender:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === gender.toLowerCase()) {
            this.nextNodeAlt = `${nextNode}_${value}`;                
            setCurrentNode(this.nextNodeAlt);
        }
    };

    handlingClassPaths(value:string, setCurrentNode:any, userClass:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === userClass.toLowerCase()) {
            this.nextNodeAlt = `${nextNode}_${value}`;                
            setCurrentNode(this.nextNodeAlt);
        }
    };

    handlingChoicesPaths(currentChoice:Choice, setCurrentNode:any, userPastNodes:any) {
        const nextNode = currentChoice.next;
        let relevantStoryPaths:string | null = null;
        if (currentChoice.nodeRef) {
            for (let i = 0 ; i < currentChoice.nodeRef.length ; i++) {
               if (userPastNodes.includes(currentChoice.nodeRef[i])) {
                !relevantStoryPaths ? relevantStoryPaths=currentChoice.nodeRef[i] : relevantStoryPaths+='+'+currentChoice.nodeRef[i];
               }
            }   
        }
        console.log(`${nextNode}[${relevantStoryPaths}]`)
        setCurrentNode(`${nextNode}[${relevantStoryPaths}]`);
    };
}


// old version
//  handleExclusivePaths(currentChoice:any, setCurrentNode:any) {

//       // fetching the "alt" object
//       const alt = currentChoice.alt;
//       // race exclusive paths
//       if (alt.type === "race") {
       
//         const nextNode = currentChoice.next;
//         const userRace = this.currentUser.race;
//         let nextNodeAlt;

//         // if the user has the right gender, we alter the node.
//         alt.value === userRace?.toLowerCase() ? nextNodeAlt = `${nextNode}_${alt.value}` : nextNodeAlt=nextNode;
//         setCurrentNode(nextNodeAlt);

//       // gender exclusive paths
//       } else if (alt.type === "gender") {
//         const nextNode = currentChoice.next;
//         const userGender = this.currentUser.gender;
//         let nextNodeAlt;

//         // if the user has the right gender, we alter the node.
//         alt.value === userGender?.toLowerCase() ? nextNodeAlt = `${nextNode}_${alt.value}` : nextNodeAlt=nextNode;
//         setCurrentNode(nextNodeAlt);
//       }
//     }