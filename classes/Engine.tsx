'use client'
// describe the 'nodes' global object

import {Nodes, User, Encounter } from '@/types/types'
import AbilityChecks from "./AbilityChecks";
import Penalties from "./Penalties";
import ExclusivePaths from "./ExclusivePaths";
import Combat from "./Combat";
import ChoicesOptions from "./Choices";


export default class Engine {

    // main attributes
    private node;
    private currentUser;

    // campaign attribute
    private relevantChoices:Array<string>;
    private accumulatedXp: number;

    // class workers
    private abilityChecks;
    private penalties;
    private exclusivePaths;
    private combat:any;
    private choicesOptions;
    private setCombatLog;
    private clearCombatLog

    // combat
    combatLockOn:boolean;

    constructor(
      node:keyof Nodes | undefined, 
      currentUser:User, 
      setCombatLog:React.Dispatch<React.SetStateAction<any>>, 
      clearCombatLog:React.Dispatch<React.SetStateAction<any>>) {

        // campaign
        this.node = node;
        this.currentUser=currentUser;
        this.accumulatedXp=0;

        // combat
        this.setCombatLog = setCombatLog;
        this.clearCombatLog = clearCombatLog;
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
    async determineNextNode(updateNode:any, currentChoice:any, setData:any, userPastNodes:any, clearNbOfTurn:any) {

      // ability checks
      if (currentChoice.check) {
        const check = this.abilityChecks.handler(currentChoice, this.node);
        if (check === null || check === undefined) return;
        if (check.result === false) {
          currentChoice.fail && updateNode(currentChoice.fail);
          setData((prev: any) => ({...prev, type:'ability', success:false, value:check.value, status:true}));
        } else {
          updateNode(currentChoice.next);
          setData((prev: any) => ({...prev, type:'ability', success:true, value:check.value, status:true}));
          this.accumulatedXp = this.accumulatedXp + currentChoice.xp;
        };

      //penalties
      } else if (currentChoice.penalty) {
        this.penalties.handler(currentChoice, updateNode, setData);

      //exclusive dialog, choice options
      } else if (currentChoice.alt) {
        this.exclusivePaths.handler(currentChoice, updateNode);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));
      
      // launching combat
      } else if (currentChoice.combat_started) {
        this.combat = new Combat(
          this.setCombatLog, 
          this.clearCombatLog, 
        )
        this.combat.preparingCombat(currentChoice, clearNbOfTurn);
        updateNode(currentChoice.next);

      //exclusive dialog, choices based on the user's past decisions
      } else if (currentChoice.nodeRef) {
        this.exclusivePaths.handlingChoicesPaths(currentChoice, updateNode, userPastNodes);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));

      //launching the end screen, displaying the relevant decisions made by the user
      } else if (currentChoice.campaignEnd) {
        this.relevantChoices = currentChoice.relevantNodes.filter((n: any) => {
          if (userPastNodes.includes(n.node)) {
            return n.text;
          };
        });
        updateNode(currentChoice.next);

      //normal nodes
      } else {
        updateNode(currentChoice.next);
        setData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
    }

    //FOR COMBAT ONLY : IF THE PLAYER MAKES A MOVE, WE CALL THIS METHOD
    async handlePlayerCombatChoices(item:any, updateNode:any, setNbOfTurn:any, clearNbOfTurn:any, setSoundEffect:any) {
          if (!this.combatLockOn) {
            this.combatLockOn=true;
             await this.combat.system(item, updateNode, this.node, setNbOfTurn, clearNbOfTurn, setSoundEffect)
            .then(() => this.combatLockOn=false);
        }
    }

    // THE DISPLAYED CHOICES MUST BE FILTERED, FORMATTED, PREPARED. WE HANDLE IT HERE.
    prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userPastChoices:any) {
      this.choicesOptions.handler(setAllAvailableChoices, choices, userPastChoices)
    }

    // we use this method to save the new user's data in the database at the end of the campaign
    async savingUserData(currentUser:User) {
      if (!currentUser) return;
      const response = await fetch(`/api/users/${this.currentUser.id}`, {
        method: 'PUT',
        headers: {'content-type': 'application/JSON'},
        body: JSON.stringify(currentUser)
      });
      const feedback = await response.json();
      if (feedback.success ) {
        console.log("user mis à jour")
        console.log(currentUser)
      } else {
        console.log("erreur lors de la mise à jour")
      }


    }

    // setter to update the current node inside the class 
    updateNode(node:string) {
      this.node = node;
    }

    // setter to update the current user data inside the class
    updateUser(currentUser:User) {
      this.currentUser = {...currentUser};
    }

    // getter to display the relevant choices array outside the class
    getRelevantChoices() {
      return this.relevantChoices;
    }

    getAccumulatedXp() {
      return this.accumulatedXp;
    }
}

