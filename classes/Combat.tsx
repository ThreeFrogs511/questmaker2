
import {Nodes, User, Encounter, Choice } from '@/types/types'
import Enemy from './Enemy';
import { useUserStore } from '@/stores/useUserStore';
import { useCombatStore } from '@/stores/useCombatStore';

export default class Combat {

    private currentUser;
    private updateStats;
    private userModifier;
    private clearCombatLog;
    private setCombatLog;
    private userFirstToAttack:boolean;
    private updateEnemy;
    private tempUserStats: User | undefined;
    private createEnemy;
    private enemyModifier;
    private encounter: Encounter | undefined;
    private fight_over:boolean;
    
    


    constructor(
      setCombatLog:any,
      clearCombatLog:any,
      // updateEnemy:(patch: Partial<Encounter | undefined>) => void
      ) {

        this.currentUser = useUserStore.getState().currentUser;
        this.updateStats = useUserStore.getState().updateStats;
        this.userModifier=0;
        this.setCombatLog = setCombatLog;
        this.clearCombatLog = clearCombatLog;

        this.userFirstToAttack=true;
        this.tempUserStats;

        this.createEnemy = new Enemy();
        // this.updateEnemy=updateEnemy;
        this.updateEnemy=useCombatStore.getState().updateEnemy;
        this.encounter;
        this.enemyModifier=0;
        this.fight_over=false;
    }   

    // who start first : the user or the enemy
    handleIniative() {

      // user initiative
      const userDex= this.currentUser.dex;
      const userModifier = userDex && Math.floor((userDex-10)/2);
      this.userModifier=userModifier ?? 0;
      let initiativeRollUser = userModifier && Math.floor(Math.random() * 20)+1+userModifier;


      // enemy initiative

      let initiativeRollEnemy=10;
      if (this.encounter && this.encounter.stats && this.encounter.stats.dex) {
      const enemyDex = this.encounter.stats.dex;
      const enemyModifier =  Math.floor((enemyDex-10)/2);
      this.enemyModifier = enemyModifier ?? 0;
      initiativeRollEnemy = Math.floor(Math.random() * 20)+1+enemyModifier;
      }

      if (initiativeRollUser && initiativeRollEnemy) {
        if (initiativeRollUser > initiativeRollEnemy ) {
          this.userFirstToAttack=true;
          return;
        } else if (initiativeRollEnemy > initiativeRollUser) {
          this.userFirstToAttack= false;
          return;
        } else if (initiativeRollEnemy === initiativeRollUser) {
          this.handleIniative();
        }
      }
    }

    handleAttackRolls(AC:number, modifier:number) {
      let attackRoll = Math.floor(Math.random() * 20)+1+modifier+(AC-10);
      const hit = AC>attackRoll ? false : true;
      return {hit:hit, roll:attackRoll};
    }

    // AC = determine the probability of avoiding enemy's attacks
    calculatingAC() {

      //enemy AC
      if (!this.encounter) return;
      const enemyDex = this.encounter.stats ? this.encounter.stats.dex : 10;
      const enemyModifier =  Math.floor((enemyDex-10)/2);
      const ac = 10+enemyModifier;
      this.updateEnemy({ac:ac});


    }

    calculatingMainModifierForAttackRolls() {
      // 
    }

    preparingCombat(currentChoice:Choice, clearNbOfTurn:any) {

      //resetting nb of turn
      clearNbOfTurn(1);
      // creating a virtual user stats object
      this.tempUserStats = {...this.currentUser}
    
      // fetching the main combat object, used for setting up enemy or resetting the fight
      this.encounter = {...this.createEnemy.fetchEnemyData(currentChoice.enemy_id)};
      if (!this.encounter) return;

      this.updateEnemy({...this.encounter});

      this.handleIniative();
      this.calculatingAC();
    }

    async system(
      item:any, 
      setCurrentNode:any, 
      node:keyof Nodes | undefined, 
      setNbofTurn:any, 
      clearNbOfTurn:any, 
      setSoundEffect:any) {

        // the main system is here
        // either the user or the enemy attack first based on the initiative
        // then we wait 1sec to add a realistic delay between the attacks
        // then the other player attacks
        // only then we unlock the attack options

        if (this.userFirstToAttack)  { 
          this.clearCombatLog()
          await this.handleUserTurn(item, setCurrentNode, node, setSoundEffect, clearNbOfTurn);
          
          // if user win, we kill everything
          if (this.fight_over) return;

          await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
          await this.handleEnemyTurn(setCurrentNode, setSoundEffect,  clearNbOfTurn, node);
          await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
          if(!this.fight_over) setNbofTurn(1);
          
        } else {
          this.clearCombatLog()
          await this.handleEnemyTurn(setCurrentNode, setSoundEffect,  clearNbOfTurn,node);
          
          // if the user lose, we kill everything
          if (this.fight_over) return;

          await new Promise<void>((resolve => {setTimeout(() => resolve(), 1000);}))
          await this.handleUserTurn(item, setCurrentNode, node, setSoundEffect,  clearNbOfTurn);
          await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);});
          if(!this.fight_over) setNbofTurn(1);
          
        }
        
      
    }

    async handleUserTurn(
      item:any, 
      setCurrentNode:any, 
      node:keyof Nodes | undefined, 
      setSoundEffect:any, 
      clearNbOfTurn:any) {

      return new Promise<void>( async (resolve) => {
        this.fight_over &&= false;
        // the attack chosen by the user 
        const attack = item.text;
        // the dmg in %. For example, if dmg = 10(%)
        // we will remove 90% so 1-(10/100)
        const dmgMax = item.userDmg;
        let finalDmg;
        if (dmgMax) {finalDmg = Math.floor(Math.random() * dmgMax)+1;}

          // the user remove x% of the enemy HP.
        if (finalDmg && this.encounter && this.encounter.hp) {

          const attackRoll = this.handleAttackRolls(this.encounter.ac ?? 10, this.userModifier);

          if (!attackRoll.hit) {
            setSoundEffect('user_miss')
            const log = `
            <div className="lg:text-xl text-xs mb-1">
              You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
            </div>`;
            this.setCombatLog(log);
            resolve();
          } else {
            setSoundEffect(attack);
            const log = `
            <div className="lg:text-xl text-xs mb-1">
              You use <span style="color:yellow">${attack}</span> for <span style="color:yellow">${finalDmg}</span> damage!
            </div>`;
            this.setCombatLog(log);


            // AFTER THE USER'S MOVE, WE NEED TO UPDATE THE NEW ENEMY HP VALUE
            // AND THEIR HP BAR SEPARATELY

            //1) updating the enemy hp value
            this.encounter.hp = Math.floor(this.encounter.hp-finalDmg);

            //2) updating the hitpoints bar outside this class
            if (this.encounter && this.encounter.hp!==undefined) {
              this.updateEnemy({hp:this.encounter.hp})
            }
          
            // DEALING WITH THE FALLOUT : IF THE PLAYER WIN OR NOT
            if (this.encounter.hp <=0) {
              // prevent another turn from incrementing because the fight is over
              this.fight_over=true;
              // small delay
              await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
              // clearing log and nb of turn
              this.clearCombatLog();
              clearNbOfTurn(1);
              // updating user's stats in the state with the virtual user state used in this class
              // updateStats({...this.currentUser});
              this.updateStats({...this.currentUser});
              // finally moving on to the victory node
              setCurrentNode(`${node}_victory`);
              resolve();
            } else {
              resolve();
            }
          }
        }
        })
      }

    async handleEnemyTurn(
    setCurrentNode:any, 
    setSoundEffect:any, 
    clearNbOfTurn:any,  
    node:keyof Nodes | undefined) {
      return new Promise<void>( async (resolve) => {
        // We extract all the attacks that can be used by the enemy 
        if (!this.encounter) return;
        this.fight_over &&= false;

        const moves = this.encounter.movesets && Object.entries(this.encounter.movesets);

        if (moves && this.currentUser.hp) {
            
          // we pick an attack at random : the name and the dmg done
          const [enemyAttack, enemyDmg] = moves[Math.floor(Math.random() * moves.length)];
        
          // we calculate the amount of dmg inflicted at random (dice roll)
          const enemyFinalDmg = Math.floor(Math.random()*enemyDmg)+1;

          // we calculate if the enemy hit or miss
          const attackRoll = this.handleAttackRolls(this.currentUser.ac ?? 10, this.enemyModifier);

          if (!attackRoll.hit) {
            setSoundEffect('enemy_miss')
            const log = 
              `<div className="lg:text-xl text-xs mb-1">
              The enemy missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})<br>
              </div>`;
            this.setCombatLog(log);
            resolve();
          } else {
            setSoundEffect(enemyAttack);
            const log = 
            `<div className="lg:text-xl text-xs mb-1">
            The enemy uses <span style="color:yellow">${enemyAttack}</span> for <span style="color:yellow">${enemyFinalDmg}</span> damage!
            </div>`;
            this.setCombatLog(log);
          
          // incrementing the total damage taken
          this.currentUser.damage_taken = this.currentUser.damage_taken + enemyFinalDmg;

          //prevent the damage to be superior to the hp in order to avoid negative values
          this.currentUser.damage_taken >= this.currentUser.hp && (this.currentUser.damage_taken = this.currentUser.hp);

          // calculate the user's current virtual hp compared to total damage taken
          const hpLeft = this.currentUser.hp-this.currentUser.damage_taken;

          // updating the real state to update the hp bar in the combatInterface component
          // updateStats({damage_taken:this.currentUser.damage_taken});
          this.updateStats({damage_taken:this.currentUser.damage_taken});

          // FALLOUT : if the player loses or not
          if (hpLeft<=0) {
            // prevent another turn from incrementing because the fight is over
            this.fight_over=true;

            // adding a small delay 
            await new Promise<void>(resolve => {setTimeout(() => {resolve()}, 1000);})
            // clearing log and nb of turn
            this.clearCombatLog();
         

            // moving to the game over and restart node
            setCurrentNode(`${node}_game_over`);
            clearNbOfTurn(1);
            // resetting the user stats and enemy
            // updateStats({damage_taken: this.tempUserStats?.damage_taken});        
            this.updateStats({damage_taken: this.tempUserStats?.damage_taken});        
            resolve();
          } else {
            resolve();
          }
          }
        }
      })
    }

    // updateStats(patch:any) {
    //   useUserStore.getState().updateStats(patch);
    // }
   
}
