
import { Choice, User, Nodes, Encounter } from "@/components/Campaigns/NodeTypes";
import { Play } from "next/font/google";

export default class Combat {

    private currentUser;
    private setCurrentUser;
    private turn;
    private currentCampain;
    private setCombatLog;
    private userFirstToAttack:boolean;
    private setEnemyData;
    private nbOfTurn:number;

    private userAC;
    private enemyAC;
    

    constructor(
      currentUser:User, 
      setCurrentUser:React.Dispatch<React.SetStateAction<User>>, 
      currentCampaign: Nodes | undefined, 
      setCombatLog:any,
      setEnemyData:React.Dispatch<React.SetStateAction<Encounter | undefined >>,
      combatLockOn:boolean) {

        this.currentUser = currentUser;
        this.setCurrentUser=setCurrentUser;
        this.currentCampain = currentCampaign;

        this.turn = {user:false, enemy:false};
        this.nbOfTurn=1;
        this.setCombatLog = setCombatLog;
        this.userFirstToAttack=true;
        this.setEnemyData=setEnemyData;

        this.userAC=10;
        this.enemyAC=10;
    }   

    // who start first : the user or the enemy
    handleIniative(encounter:Encounter) {

      // user initiative
      const userDex= this.currentUser.dex;
      const userModifier = userDex && Math.floor((userDex-10)/2);
      let initiativeRollUser = userModifier && Math.floor(Math.random() * 20)+1+userModifier;


      // enemy initiative

      let initiativeRollEnemy=10;
      if (encounter && encounter.stats && encounter.stats.dex) {
      const enemyDex = encounter.stats.dex;
      const enemyModifier =  Math.floor((enemyDex-10)/2);
      initiativeRollEnemy = Math.floor(Math.random() * 20)+1+enemyModifier;
      }

      if (initiativeRollUser && initiativeRollEnemy) {
        if (initiativeRollUser > initiativeRollEnemy ) {
          console.log("you start first")
          this.userFirstToAttack=true;
          return;
        } else if (initiativeRollEnemy > initiativeRollUser) {
          console.log("the enemy start first")
          this.userFirstToAttack= false;
          return;
        } else if (initiativeRollEnemy === initiativeRollUser) {
          this.handleIniative(encounter);
        }
      }
    }

    handleAttackRolls(AC:number) {
      let attackRoll = Math.floor(Math.random() * 20)+1+(AC-10);
      const hit = AC>attackRoll ? false : true;
      return {hit:hit, roll:attackRoll};
    }

    preparingCombat(currentChoice:Choice) {

      // fetching the main combat object
      const combatData = currentChoice.enemy;

      // fetching useful enemy data
      let enemyName = combatData[0];
      let enemyStats = combatData[1];
      let enemyStartingHp= combatData[2];
      let enemyStartingDopamine = combatData[3];
      let enemyMoveSets = combatData[4];

      let encounter: Encounter = {
        name: enemyName,
        stats: enemyStats,
        hp: enemyStartingHp,
        dopamine:enemyStartingDopamine,
        movesets:enemyMoveSets
      }

      this.handleIniative(encounter);
      this.calculatingAC(encounter);
      return encounter;

    }

    async system(item:any, encounter:Encounter, setCurrentNode:any, node:keyof Nodes | undefined, setNbofTurn:any, setSoundEffect:any ) {
      
        // the main system is here
        // either the user or the enemy attack first based on the initiative
        // then we wait 1sec to add a realistic delay between the attacks
        // then the other player attacks
        // only then we unlock the attack options
        if (this.userFirstToAttack)  { 
          this.setCombatLog('')
          await this.handleUserTurn(item, encounter, setCurrentNode, node, setSoundEffect);
          await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
          await this.handleEnemyTurn(encounter, setCurrentNode, node, setSoundEffect);
          await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 200);})
          setNbofTurn((prev: number) => prev+1);
        } else {
           this.setCombatLog('')
          await this.handleEnemyTurn(encounter, setCurrentNode, node, setSoundEffect);
          await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
          await this.handleUserTurn(item, encounter, setCurrentNode, node, setSoundEffect);
          await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 200);});
          setNbofTurn((prev: number) => prev+1);
        }
        
      
    }

    async handleUserTurn(item:any, encounter:Encounter, setCurrentNode:any, node:keyof Nodes | undefined, setSoundEffect:any) {

      return new Promise<void>( async (resolve) => {
        // the attack chosen by the user 
        const attack = item.text;
        // the dmg in %. For example, if dmg = 10(%)
        // we will remove 90% so 1-(10/100)
        const dmgMax = item.userDmg;
        let finalDmg;
        if (dmgMax) {finalDmg = Math.floor(Math.random() * dmgMax)+1;}

          // the user remove x% of the enemy HP.
        if (finalDmg && encounter.hp) {

          const attackRoll = this.handleAttackRolls(this.userAC);

          if (!attackRoll.hit) {
            setSoundEffect('user_miss')
            const log = `
            <div className="lg:text-xl text-xs mb-1">
              You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
            </div>`;
            this.setCombatLog((prev: string) => prev + log);
            resolve();
          } else {
            setSoundEffect(attack);
            const log = `
            <div className="lg:text-xl text-xs mb-1">
              You use <span style="color:yellow">${attack}</span> for <span style="color:yellow">${finalDmg}</span> damage!
            </div>`;
            this.setCombatLog((prev: string) => prev + log);

            // calculating new enemy hp...
            encounter.hp = Math.floor(encounter.hp*(1-finalDmg/100));
            this.setEnemyData(prev => ({...prev, hp:encounter.hp}))
          
            if (encounter.hp <=0) {
              await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
              this.setCombatLog(null);
              setCurrentNode(`${node}_victory`);
              resolve();
            } else {
              resolve();
            }
          }
        }
        })
      }

    async handleEnemyTurn(encounter:Encounter, setCurrentNode:any, node: keyof Nodes | undefined, setSoundEffect:any) {
      return new Promise<void>( async (resolve) => {
        // We extract all the attacks that can be used by the enemy 
        const moves = encounter.movesets && Object.entries(encounter.movesets);

        if (moves && this.currentUser.hp) {
            
          // we pick an attack at random : the name and the dmg done
          const [enemyAttack, enemyDmg] = moves[Math.floor(Math.random() * moves.length)];
        
          // we calculate the amount of dmg inflicted at random (dice roll)
          const enemyFinalDmg = Math.floor(Math.random()*enemyDmg)+1;

          // we calculate if the enemy hit or miss
          const attackRoll = this.handleAttackRolls(this.enemyAC);
          if (!attackRoll.hit) {
            setSoundEffect('enemy_miss')
            const log = 
              `<div className="lg:text-xl text-xs mb-1">
              The enemy missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})<br>
              </div>`;
            this.setCombatLog((prev: string) => prev + log);
            resolve();
          } else {
            setSoundEffect(enemyAttack);
          // updating the log
          const log = 
          `<div className="lg:text-xl text-xs mb-1">
          The enemy uses <span style="color:yellow">${enemyAttack}</span> for <span style="color:yellow">${enemyFinalDmg}</span> damage!
          </div>`;
          this.setCombatLog((prev: string) => prev + log);
          
          // we remove x% off the user's hp based on the enemy attack value
          this.currentUser.damage_taken = this.currentUser.damage_taken + enemyDmg;

          // calculate the user's current hp after the attack
          const hpLeft = (this.currentUser.hp/this.currentUser.hp)*100-this.currentUser.damage_taken;

          // attack consequence
          if (hpLeft<=0) {
            // adding a small delay to give enough time to see the hp bars go down to 0 before 
            // going to the next node
            await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
            this.setCombatLog(null);
            setCurrentNode("game_over");
            resolve();
          } else {
            resolve();
          }
          }
        }
      })
    }

    // AC = determine the probability of avoiding enemy's attacks
    calculatingAC(encounter:Encounter) {

      // user AC
      const userDex= this.currentUser.dex;
      const userModifier = userDex && Math.floor((userDex-10)/2);
      this.userAC = userModifier ? 10+userModifier : 10;
      console.log("Your AC is " + this.userAC)

      //enemy AC
      const enemyDex = encounter.stats ? encounter.stats.dex : 10;
      const enemyModifier =  Math.floor((enemyDex-10)/2);
      this.enemyAC = 10+enemyModifier;
      console.log("enemy AC is " + this.enemyAC);


    }
}


// export default class Combat {

//     private currentUser;
//     private setCurrentUser;
//     private turn;
//     private currentCampain;
//     private setCombatLog;
//     private userFirstToAttack:boolean;
//     private setEnemyData;
//     private nbOfTurn:number;

//     private userAC;
//     private enemyAC;
    

//     constructor(
//       currentUser:User, 
//       setCurrentUser:React.Dispatch<React.SetStateAction<User>>, 
//       currentCampaign: Nodes | undefined, 
//       setCombatLog:any,
//       setEnemyData:React.Dispatch<React.SetStateAction<Encounter | undefined >>,
//       combatLockOn:boolean) {

//         this.currentUser = currentUser;
//         this.setCurrentUser=setCurrentUser;
//         this.currentCampain = currentCampaign;

//         this.turn = {user:false, enemy:false};
//         this.nbOfTurn=1;
//         this.setCombatLog = setCombatLog;
//         this.userFirstToAttack=true;
//         this.setEnemyData=setEnemyData;

//         this.userAC=10;
//         this.enemyAC=10;
//     }   

//     // who start first : the user or the enemy
//     handleIniative(encounter:Encounter) {

//       // user initiative
//       const userDex= this.currentUser.dex;
//       const userModifier = userDex && Math.floor((userDex-10)/2);
//       let initiativeRollUser = userModifier && Math.floor(Math.random() * 20)+1+userModifier;


//       // enemy initiative

//       let initiativeRollEnemy=10;
//       if (encounter && encounter.stats && encounter.stats.dex) {
//       const enemyDex = encounter.stats.dex;
//       const enemyModifier =  Math.floor((enemyDex-10)/2);
//       initiativeRollEnemy = Math.floor(Math.random() * 20)+1+enemyModifier;
//       }

//       if (initiativeRollUser && initiativeRollEnemy) {
//         if (initiativeRollUser > initiativeRollEnemy ) {
//           console.log("you start first")
//           this.userFirstToAttack=true;
//           return;
//         } else if (initiativeRollEnemy > initiativeRollUser) {
//           console.log("the enemy start first")
//           this.userFirstToAttack= false;
//           return;
//         } else if (initiativeRollEnemy === initiativeRollUser) {
//           this.handleIniative(encounter);
//         }
//       }
//     }

//     handleAttackRolls(AC:number) {
//       const attackRoll = Math.floor(Math.random() * 20)+1+(AC-10);
//       const hit = AC>attackRoll ? false : true;
//       return hit;
//     }

//     preparingCombat(currentChoice:Choice) {

//       // fetching the main combat object
//       const combatData = currentChoice.enemy;

//       // fetching useful enemy data
//       let enemyName = combatData[0];
//       let enemyStats = combatData[1];
//       let enemyStartingHp= combatData[2];
//       let enemyStartingDopamine = combatData[3];
//       let enemyMoveSets = combatData[4];

//       let encounter: Encounter = {
//         name: enemyName,
//         stats: enemyStats,
//         hp: enemyStartingHp,
//         dopamine:enemyStartingDopamine,
//         movesets:enemyMoveSets
//       }

//       this.handleIniative(encounter);
//       this.calculatingAC(encounter);
//       return encounter;

//     }

//     async system(currentChoice:Choice, encounter:Encounter, setCurrentNode:any, node:keyof Nodes | undefined, ) {
      
//         // cleaning the displayed text for the next turn if necessary
//         if (this.currentCampain && node) {
//           this.currentCampain[node].text = `<h2 className="underline">Turn ${this.nbOfTurn}</h2></br>`;
//           this.setCombatLog('');
//         }

        
//         // the main system is here
//         // either the user or the enemy attack first based on the initiative
//         // then we wait 1sec to add a realistic delay between the attacks
//         // then the other player attacks
//         // only then we unlock the attack options
//         if (this.userFirstToAttack)  { 
//           await this.handleUserTurn(currentChoice, encounter, setCurrentNode, node);
//           await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
//           await this.handleEnemyTurn(currentChoice, encounter, setCurrentNode, node);
//           await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 200);})

//         } else {
//           await this.handleEnemyTurn(currentChoice, encounter, setCurrentNode, node);
//           await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
//           await this.handleUserTurn(currentChoice, encounter, setCurrentNode, node);
//           await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 200);})

//         }
//         this.nbOfTurn++;
      
//     }

//     async handleUserTurn(currentChoice:Choice, encounter:Encounter, setCurrentNode:any, node:keyof Nodes | undefined) {

//       return new Promise<void>( async (resolve) => {
//         // the attack chosen by the user 
//         const attack = currentChoice.text;
//         // the dmg in %. For example, if dmg = 10(%)
//         // we will remove 90% so 1-(10/100)
//         const dmgMax = currentChoice.userDmg;
//         let finalDmg;
//         if (dmgMax) {finalDmg = Math.floor(Math.random() * dmgMax)+1;}

//           // the user remove x% of the enemy HP.
//         if (finalDmg && encounter.hp) {

//           const attackRoll = this.handleAttackRolls(this.userAC);

//           if (!attackRoll) {
//             const log = `
//             <div className="lg:text-base text-xs mb-5">
//               You missed!
//             </div>`;
//             this.setCombatLog((prev: string) => prev + log);
//             resolve();
//           } else {


//             const log = `
//             <div className="lg:text-base text-xs mb-5">
//               You use <span style="color:yellow">${attack}</span> for <span style="color:yellow">${finalDmg}</span> damage!
//             </div>`;
//             this.setCombatLog((prev: string) => prev + log);

//             // calculating new enemy hp...
//             encounter.hp = Math.floor(encounter.hp*(1-finalDmg/100));
//             this.setEnemyData(prev => ({...prev, hp:encounter.hp}))

//             // adding a small delay to give enough time to see the hp bars go down to 0 before 
//             // going to the next node

          

//             if (encounter.hp <=0) {
//               await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
//               this.setCombatLog(null);
//               setCurrentNode(`${node}_victory`);
//               resolve();
//             } else {
//               resolve();
//             }
//           }
//         }
//         })
//       }

//     async handleEnemyTurn(currentChoice:Choice, encounter:Encounter, setCurrentNode:any, node: keyof Nodes | undefined) {
//       return new Promise<void>( async (resolve) => {
//         // We extract all the attacks that can be used by the enemy 
//         const moves = encounter.movesets && Object.entries(encounter.movesets);

//         if (moves && this.currentUser.hp) {
            
//           // we pick an attack at random : the name and the dmg done
//           const [enemyAttack, enemyDmg] = moves[Math.floor(Math.random() * moves.length)];
        
//           // we calculate the amount of dmg inflicted at random (dice roll)
//           const enemyFinalDmg = Math.floor(Math.random()*enemyDmg)+1;

//           // we calculate if the enemy hit or miss
//           const attackRoll = this.handleAttackRolls(this.enemyAC);
//           if (!attackRoll) {
//             const log = 
//               `<div className="lg:text-base text-xs mb-5">
//               The enemy missed!<br>
//               </div>`;
//             this.setCombatLog((prev: string) => prev + log);
//             resolve();
//           } else {

//           // updating the log
//           const log = 
//           `<div className="lg:text-base text-xs mb-5">
//           The enemy uses <span style="color:yellow">${enemyAttack}</span> for <span style="color:yellow">${enemyFinalDmg}</span> damage!
//           </div>`;
//           this.setCombatLog((prev: string) => prev + log);
          
//           // we remove x% off the user's hp based on the enemy attack value
//           this.currentUser.damage_taken = this.currentUser.damage_taken + enemyDmg;

//           // calculate the user's current hp after the attack
//           const hpLeft = (this.currentUser.hp/this.currentUser.hp)*100-this.currentUser.damage_taken;



//           // attack consequence
//           if (hpLeft<=0) {
//             // adding a small delay to give enough time to see the hp bars go down to 0 before 
//             // going to the next node
//             await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
//             this.setCombatLog(null);
//             setCurrentNode("game_over");
//             resolve();
//           } else {
//             resolve();
//           }
//           }
//         }
//       })
//     }

//     // AC = determine the probability of avoiding enemy's attacks
//     calculatingAC(encounter:Encounter) {

//       // user AC
//       const userDex= this.currentUser.dex;
//       const userModifier = userDex && Math.floor((userDex-10)/2);
//       this.userAC = userModifier ? 10+userModifier : 10;
//       console.log("Your AC is " + this.userAC)

//       //enemy AC
//       const enemyDex = encounter.stats ? encounter.stats.dex : 10;
//       const enemyModifier =  Math.floor((enemyDex-10)/2);
//       this.enemyAC = 10+enemyModifier;
//       console.log("enemy AC is " + this.enemyAC);


//     }


// }