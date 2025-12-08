'use client'
// describe the 'nodes' global object
import { Nodes, User, Encounter } from "@/components/Campaigns/NodeTypes";
import AbilityChecks from "./AbilityChecks";
import Penalties from "./Penalties";
import ExclusivePaths from "./ExclusivePaths";
import Combat from "./Combat";
import ChoicesOptions from "./Choices";
import { log } from "console";


export default class Engine {

    // main attributes
    private node;
    private currentUser;
    private setCurrentUser;


    // class workers
    private abilityChecks;
    private penalties;
    private exclusivePaths;
    private combat;
    private choicesOptions;
    private currentCampaign;
    private setCombatLog;

    // combat
    private encounter: Encounter | undefined;
    private setEnemyData;
    combatLockOn:boolean;

    constructor(
      currentCampaign: Nodes | undefined, 
      node:keyof Nodes | undefined, 
      currentUser:User, 
      setCurrentUser:React.Dispatch<React.SetStateAction<User>>,
      setCombatLog:React.Dispatch<React.SetStateAction<any>>, 
      enemyData:Encounter | undefined,
      setEnemyData:React.Dispatch<React.SetStateAction<Encounter | undefined>>) {

      this.currentCampaign = currentCampaign;
        this.node = node;
        this.currentUser=currentUser;
        this.setCurrentUser=setCurrentUser;

        // combat
        this.encounter = enemyData;
        this.setEnemyData = setEnemyData;
        this.setCombatLog = setCombatLog;
        this.combatLockOn = false;

        // secondary classes
        this.abilityChecks = new AbilityChecks();
        this.penalties = new Penalties();
        this.exclusivePaths = new ExclusivePaths();
        this.combat = new Combat(this.currentUser, this.setCurrentUser, this.currentCampaign,  this.setCombatLog, this.setEnemyData, this.combatLockOn);
        this.choicesOptions = new ChoicesOptions(this.currentUser)
        
    }    


    async determineNextNode(setCurrentNode:any, currentChoice:any, setAbilityCheckData:any) {
      if(currentChoice.check) {
        this.abilityChecks.handler(currentChoice, setCurrentNode, setAbilityCheckData, this.node, this.currentUser);

      } else if (currentChoice.penalty) {
        this.penalties.handler(currentChoice, setCurrentNode, this.currentUser, this.setCurrentUser);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));


      } else if (currentChoice.alt) {
        this.exclusivePaths.handler(currentChoice, setCurrentNode, this.currentUser);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));

       
      } else if (currentChoice.combat_started) {
        this.encounter = this.combat.preparingCombat(currentChoice);
        this.setEnemyData(this.encounter);
        setCurrentNode(currentChoice.next);
        this.updateNode(currentChoice.next);
      
      } else if (currentChoice.combat_on) {
        // the main combat system

        // if (this.encounter) {
        //   if (!this.combatLockOn) {
        //     this.combatLockOn=true;
        //      await this.combat.system(currentChoice, this.encounter, setCurrentNode, this.node)
        //     .then(() => this.combatLockOn=false);
        //   }
        // }

      } else {
        setCurrentNode(currentChoice.next);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
     }

     async handlePlayerCombatChoices(item:any, setCurrentNode:any, setNbOfTurn:any, setSoundEffect:any) {
       if (this.encounter) {
          if (!this.combatLockOn) {
            this.combatLockOn=true;
             await this.combat.system(item, this.encounter, setCurrentNode, this.node, setNbOfTurn, setSoundEffect)
            .then(() => this.combatLockOn=false);
          }
        }
     }

    prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userPastChoices:any) {
      this.choicesOptions.handler(setAllAvailableChoices, choices, userPastChoices)
    }
 
    updateNode(node:string) {
      this.node = node;
    }
}

