'use client'
// describe the 'nodes' global object

import {Nodes, User} from '@/types/types'
import AbilityChecks from "./AbilityChecks";
import Penalties from "./Penalties";
import ExclusivePaths from "./ExclusivePaths";
import Combat from "./CombatSystem/Combat";
import ChoicesOptions from "./Choices";

import { useNarrationStore } from '@/stores/useNarrationStore';

export default class Engine {

    // main attributes
    private node;
    private updateNode;

    // campaign attribute
    private relevantChoices:Array<string>;
    private accumulatedXp: number;

    // class workers
    private abilityChecks;
    private penalties;
    private exclusivePaths;
    private combat:any;
    private choicesOptions;

    // combat
    combatLockOn:boolean;

    constructor(node:keyof Nodes | undefined,) {

        // campaign
        this.node = node;
        this.updateNode = useNarrationStore.getState().updateNode;
        this.accumulatedXp=0;


        this.combatLockOn = false;

        // secondary classes
        this.abilityChecks = new AbilityChecks();
        this.penalties = new Penalties();
        this.exclusivePaths = new ExclusivePaths();
        this.combat;
        this.choicesOptions = new ChoicesOptions()

        //stores the important decisions made during the campaign
        this.relevantChoices = [];
        
    }    


    // THIS METHOD DETERMINES THE NEXT NODE BASED ON THE USER'S CHOICE.
    // IF THE NODE IS UNIQUE (PENALTY, ABILITY CHECKS, COMBAT), WE HANDLE IT HERE
    async determineNextNode(currentChoice:any, setData:any, userPastNodes:any, clearNbOfTurn:any) {
      
      // ability checks
      if (currentChoice.check) {
        const check = this.abilityChecks.handler(currentChoice, this.node);
        if (check === null || check === undefined) return;
        if (check.result === false) {
          currentChoice.fail && this.updateNode(currentChoice.fail);
          setData((prev: any) => ({...prev, type:'ability', success:false, value:check.value, status:true}));
        } else {
          this.updateNode(currentChoice.next);
          setData((prev: any) => ({...prev, type:'ability', success:true, value:check.value, status:true}));
          this.accumulatedXp = this.accumulatedXp + currentChoice.xp;
        };

      //penalties
      } else if (currentChoice.penalty) {
        this.penalties.handler(currentChoice, setData);
        this.updateNode(currentChoice.next);

      //exclusive dialog, choice options
      } else if (currentChoice.alt) {
        const nextNode = this.exclusivePaths.handler(currentChoice, this.updateNode);
        this.updateNode(nextNode);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));
      
      // launching combat
      } else if (currentChoice.combat_started) {
        this.combat = new Combat();
        this.combat.preparingCombat(currentChoice, clearNbOfTurn);
        this.updateNode(currentChoice.next);

      //exclusive dialog, choices based on the user's past decisions
      } else if (currentChoice.nodeRef) {
        const nextNode = this.exclusivePaths.handlingChoicesPaths(currentChoice, userPastNodes);
        this.updateNode(nextNode);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));

      //launching the end screen, displaying the relevant decisions made by the user
      } else if (currentChoice.campaignEnd) {
        this.relevantChoices = currentChoice.relevantNodes.filter((n: any) => {
          if (userPastNodes.includes(n.node)) {
            return n.text;
          };
        });
        this.updateNode(currentChoice.next);

      //normal nodes
      } else {
        this.updateNode(currentChoice.next);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
    }

    //FOR COMBAT ONLY : IF THE PLAYER MAKES A MOVE, WE CALL THIS METHOD
    async handlePlayerCombatChoices(item:any, setSoundEffect:any) {

        // if the user open their inventory
          if (item.text ==="inventory") {
            this.combat.inventoryHandler();
            return;
          };

          // if the user choose an attack
          if (!this.combatLockOn) {
            this.combatLockOn=true;
            await this.combat.system(item, this.node, setSoundEffect)
            .then(() => this.combatLockOn=false);
        }
    }

    // THE DISPLAYED CHOICES MUST BE FILTERED, FORMATTED, PREPARED. WE HANDLE IT HERE.
    prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userPastChoices:any) {
      this.choicesOptions.handler(setAllAvailableChoices, choices, userPastChoices);
    }

    // we use this method to save the new user's data in the database at the end of the campaign
    async savingUserData(currentUser:User) {
      if (!currentUser) return;
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {'content-type': 'application/JSON'},
        body: JSON.stringify(currentUser)
      });
      const feedback = await response.json();
      if (feedback.success ) {
        console.log("user mis à jour")
        console.log(currentUser)
        return {success:true}
        
      } else {
        console.log("erreur lors de la mise à jour")
        return {success:false}
      }
    }

    // setter to update the node inside the class 
    setNodeInsideEngine(node:string) {
      this.node = node;
    }

    // getters to display the decisions made during the campaign and the total xp gained in the end screen
    getRelevantChoices() {
      return this.relevantChoices;
    }

    getAccumulatedXp() {
      return this.accumulatedXp;
    }
}

