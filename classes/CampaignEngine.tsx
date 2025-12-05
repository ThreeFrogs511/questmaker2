'use client'
// describe the 'nodes' global object
import { Nodes, Node, Choice, User } from "@/components/Campaigns/NodeTypes";


export default class CampaignEngine {

    private node;
    private currentUser;
    private setCurrentUser;
    private enemyName: string | null;
    private enemyStats: {str:number, dex:number, con:number, int:number, wis:number, cha:number} | null;
    private enemyStartingHp: number | null;
    private enemyStartingDopamine : number | null;

    constructor(node:keyof Nodes | undefined, currentUser:User, setCurrentUser:any) {
        this.node = node;
        this.currentUser=currentUser;
        this.setCurrentUser=setCurrentUser;
        this.enemyName = null;
        this.enemyStats = null;
        this.enemyStartingHp = null;
        this.enemyStartingDopamine = null;
        
        
    }

    storingUserChoices(userChoices:Array<string | undefined>, setUserChoices:React.Dispatch<React.SetStateAction<Array<string | undefined>>>) {
      const choices = userChoices && [...userChoices];
      choices?.push(this.node);
      choices ? setUserChoices(choices) : setUserChoices([this.node]);
    }



    handleAbilityChecks(currentChoice:any, setCurrentNode:any, setAbilityCheckData:any) {
      if (currentChoice && this.node) {
    
          const dc = currentChoice.dc;
          if (dc) {
            const userStat: any = Object.entries(this.currentUser).find(n => n.includes(currentChoice.check));
            const modifier = Math.floor((userStat[1]-10)/2);
            const abilityScore = Math.floor(Math.random() * 20)+1+modifier;
                
            if (abilityScore<dc) {
              currentChoice.fail && setCurrentNode(currentChoice.fail);
              setAbilityCheckData((prev: any) => ({...prev, success:false, value:abilityScore, status:true}));
            } else {
              setCurrentNode(currentChoice.next);
              setAbilityCheckData((prev: any) => ({...prev, success:true, value:abilityScore, status:true}));
            }              
          }
    }}

    
    handlePenalties(currentChoice:any, setCurrentNode:any) {
      const penalty = currentChoice.penalty.ability;
      const penaltyValue = currentChoice.penalty.value;
      const penaltyTarget = Object.entries(this.currentUser).find(([key, item]) => {
        if (key === penalty) return [key, penalty];
      }) as [string, number];
      console.log(penaltyTarget)
      if (penaltyTarget && penaltyTarget[1]) {
        const newValue = penaltyTarget[1] * (1-penaltyValue/100);
        this.setCurrentUser((prev: any) => ({...prev, [penalty]:newValue}))
        setCurrentNode(currentChoice.next);
        console.log(`${this.currentUser.hp} => ${newValue}`)

      }
    }

    handleExclusivePaths(currentChoice:any, setCurrentNode:any) {

      // fetching the "alt" object
      const alt = currentChoice.alt;
      // race exclusive paths
      if (alt.type === "race") {
       
        const nextNode = currentChoice.next;
        const userRace = this.currentUser.race;
        let nextNodeAlt;

        // if the user has the right gender, we alter the node.
        alt.value === userRace?.toLowerCase() ? nextNodeAlt = `${nextNode}_${alt.value}` : nextNodeAlt=nextNode;
        setCurrentNode(nextNodeAlt);

      // gender exclusive paths
      } else if (alt.type === "gender") {
        const nextNode = currentChoice.next;
        const userGender = this.currentUser.gender;
        let nextNodeAlt;

        // if the user has the right gender, we alter the node.
        alt.value === userGender?.toLowerCase() ? nextNodeAlt = `${nextNode}_${alt.value}` : nextNodeAlt=nextNode;
        setCurrentNode(nextNodeAlt);
      }
    }

    handleCombat(currentChoice:any) {

      // fetching the main combat object
      const combatData = currentChoice.combat;

      // fetching useful enemy stats
      const enemyName = combatData[0];
      const enemyStats = combatData[1];
      const enemyStartingHp = combatData[2];
      const enemyStartingDopamine = combatData[3];

      // fetching enemy moves
      const enemyMoves = currentChoice.enemy_moves;

      // user's moves 
      // const moves []
    }

    determineNextNode2(setCurrentNode:any, currentChoice:any, setAbilityCheckData:any) {

      if(currentChoice.check) {
        this.handleAbilityChecks(currentChoice, setCurrentNode, setAbilityCheckData);

      } else if (currentChoice.penalty) {
        this.handlePenalties(currentChoice, setCurrentNode);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));

      } else if (currentChoice.alt) {
        this.handleExclusivePaths(currentChoice, setCurrentNode);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));

      } else {
        setCurrentNode(currentChoice.next);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
      }
     }

    prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userChoices:any) {

    const availableChoices = choices.filter((n: any) => {
      if (!userChoices.includes(n.text)) return n 
    });
    if (this.node && availableChoices) {
      const dynamicChoices = availableChoices.map(((n: { text: string; }) => {
          if (n.text.includes('[USERNAME]')) {
            n.text = n.text.replace('[USERNAME]', `${this.currentUser.username ?? ''}`)
            return n;
          } else if (n.text.includes('[RACE]')) {
              n.text = n.text.replace('[RACE]', `${this.currentUser.race ?? ''}`)
              return n;
          } else {
            return n;
          }
      }));
      setAllAvailableChoices(dynamicChoices);
    }}
 
    updateNode(node:string) {
      this.node = node;
    }
}

