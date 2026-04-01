import { useUserStore } from "@/stores/useUserStore";
import { Choice, Nodes } from '@/types/types'

export default class ExclusivePaths {


    constructor() {
    }

    handler(currentChoice:Choice, setCurrentNode: (node: keyof Nodes | undefined) => void) {

        // setting up
        const currentUser = useUserStore.getState().currentUser;
        const nextNode = currentChoice.next;
        let altNode;
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
                if (i === alt.length) {
                    return nextNode;
                }

                switch(alt[i].type) {
                    case "race": 
                    altNode = this.handlingRacePaths(alt[i].value, setCurrentNode, userRace ?? '', currentChoice);
                    break;

                    case "gender":
                    altNode = this.handlingGenderPaths(alt[i].value, setCurrentNode, userGender ?? '', currentChoice);
                    break;

                    case"class":
                    altNode = this.handlingClassPaths(alt[i].value, setCurrentNode, userClass ?? '', currentChoice);
                    break;

                }
              
           
            }
           return altNode;
        }
    
    }

    handlingRacePaths(value:string, setCurrentNode: (node: keyof Nodes | undefined) => void, race:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === race.toLowerCase()) {
            const nextNodeAlt = `${nextNode}_${value}`;
            return nextNodeAlt;
        }
    };
    handlingGenderPaths(value:string, setCurrentNode: (node: keyof Nodes | undefined) => void, gender:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === gender.toLowerCase()) {
            const nextNodeAlt = `${nextNode}_${value}`;    
            return nextNodeAlt;
        }
    };

    handlingClassPaths(value:string, setCurrentNode: (node: keyof Nodes | undefined) => void, userClass:string, currentChoice:Choice) {
        const nextNode = currentChoice.next;
        if (value === userClass.toLowerCase()) {
            const nextNodeAlt = `${nextNode}_${value}`; 
            return nextNodeAlt;
        }
    };

    handlingChoicesPaths(currentChoice:Choice, userPastNodes: string[]) {
        const nextNode = currentChoice.next;
        let relevantStoryPaths:string | null = null;
        if (currentChoice.nodeRef) {
            for (let i = 0 ; i < currentChoice.nodeRef.length ; i++) {
               if (userPastNodes.includes(currentChoice.nodeRef[i])) {
                !relevantStoryPaths ? relevantStoryPaths=currentChoice.nodeRef[i] : relevantStoryPaths+='+'+currentChoice.nodeRef[i];
               }
            }   
        }
        const nextNodeAlt = `${nextNode}[${relevantStoryPaths}]`;
        return nextNodeAlt;
    };
}
