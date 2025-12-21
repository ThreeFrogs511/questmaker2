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
    private updateStats;


    // class workers
    private abilityChecks;
    private penalties;
    private exclusivePaths;
    private combat:any;
    private choicesOptions;
    private setCombatLog;
    private clearCombatLog

    // combat
    private encounter: Encounter | undefined;
    private updateEnemy;
    combatLockOn:boolean;

    constructor(
      node:keyof Nodes | undefined, 
      currentUser:User, 
      updateStats: (patch: Partial<User>) => void,
      setCombatLog:React.Dispatch<React.SetStateAction<any>>, 
      clearCombatLog:React.Dispatch<React.SetStateAction<any>>,
      updateEnemy:(patch: Partial<Encounter | undefined>) => void) {

        
        this.node = node;
        this.currentUser=currentUser;
        this.updateStats=updateStats;

        // combat
        this.updateEnemy = updateEnemy;
        this.setCombatLog = setCombatLog;
        this.clearCombatLog = clearCombatLog;
        this.combatLockOn = false;

        // secondary classes
        this.abilityChecks = new AbilityChecks();
        this.penalties = new Penalties();
        this.exclusivePaths = new ExclusivePaths();
        this.combat;
        this.choicesOptions = new ChoicesOptions(this.currentUser)
        
    }    


    async determineNextNode(updateNode:any, currentChoice:any, setAbilityCheckData:any, userPastNodes:any) {
      if(currentChoice.check) {
        this.abilityChecks.handler(currentChoice, updateNode, setAbilityCheckData, this.node, this.currentUser);

      } else if (currentChoice.penalty) {
        this.penalties.handler(currentChoice, updateNode, this.updateStats);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));


      } else if (currentChoice.alt) {
        this.exclusivePaths.handler(currentChoice, updateNode, this.currentUser);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));

       
      } else if (currentChoice.combat_started) {
        this.combat = new Combat(this.currentUser, this.updateStats, this.setCombatLog, this.clearCombatLog, this.updateEnemy);
        this.combat.preparingCombat(currentChoice);
        updateNode(currentChoice.next);
        this.updateNode(currentChoice.next);
      
      } else if (currentChoice.nodeRef) {
        this.exclusivePaths.handlingChoicesPaths(currentChoice, updateNode, userPastNodes);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));

      } else {
        updateNode(currentChoice.next);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
     }

     async handlePlayerCombatChoices(item:any, updateNode:any, setNbOfTurn:any, clearNbOfTurn:any, setSoundEffect:any, updateStats:any) {
          if (!this.combatLockOn) {
            this.combatLockOn=true;
             await this.combat.system(item, updateNode, this.node, setNbOfTurn, clearNbOfTurn, setSoundEffect, updateStats)
            .then(() => this.combatLockOn=false);
        }
     }

    prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userPastChoices:any) {
      this.choicesOptions.handler(setAllAvailableChoices, choices, userPastChoices)
    }
 
    // crucial to update the current node inside the class 
    updateNode(node:string) {
      this.node = node;
    }

    updateUser(currentUser:User) {
      this.currentUser = {...currentUser};
    }
}

