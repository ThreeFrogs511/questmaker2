import {
  Moveset,
  Nodes,
  Character,
  Encounter,
  Choice,
  Item,
} from "@/types/types";
import Enemy from "./Enemy";
import { useCombatStore } from "@/stores/useCombatStore";
import { useNarrationStore } from "@/stores/useNarrationStore";
import Die from "./Die";
import ItemClass from "../ItemClass";
import characterPresets from "@/assets/characterPresets.json";

export default class Combat {
  //user's attributes
  // private currentUser;
  // private updateStats;
  private playerDataBeforeCombat: Character | undefined;
  private movesetsBeforeCombat: Moveset[] | undefined;
  private inventoryBeforeCombat: Item[] | undefined;

  private userModifier: number;
  private userFirstToAttack: boolean;

  // log attributes
  private clearCombatLog;
  private setCombatLog;

  // enemy attributes
  private updateEnemy;
  private createEnemy;
  private enemyModifier;
  private encounter: Encounter | undefined;

  // turn attributes
  private setNbOfTurn;
  private resetNbOfTurn;

  //node attribute
  private updateNode;

  //global combat attributes
  private openInventory;
  private fight_over: boolean;
  private playSfx;
  private playMusic;

  private updateRoundStatus: (boolean: boolean) => void;

  private tempPlayerData = useCombatStore.getState().tempPlayerData;
  private updateTempPlayerData = useCombatStore.getState().updateTempPlayerData;

  constructor(
    playSfx: (sfx: string) => void,
    playMusic: (music: string) => void,
  ) {
    this.playSfx = playSfx;
    this.playMusic = playMusic;

    this.userModifier = 0;

    this.setCombatLog = useCombatStore.getState().setCombatLog;
    this.clearCombatLog = useCombatStore.getState().clearCombatLog;

    this.userFirstToAttack = true;

    //snapshots of player's data to reset states after game over
    this.playerDataBeforeCombat = undefined;
    this.movesetsBeforeCombat = undefined;
    this.inventoryBeforeCombat = undefined;

    this.createEnemy = new Enemy();
    this.updateEnemy = useCombatStore.getState().updateEnemy;
    this.encounter = undefined;
    this.enemyModifier = 0;

    this.openInventory = useCombatStore.getState().openInventory;
    this.fight_over = false;

    // turn system
    this.setNbOfTurn = useCombatStore.getState().setNbOfTurn;
    this.resetNbOfTurn = useCombatStore.getState().resetNbOfTurn;

    this.updateNode = useNarrationStore.getState().updateNode;

    this.updateRoundStatus = useCombatStore.getState().updateRoundStatus;
  }

  handleIniative() {
    // user initiative
    const userDex = this.tempPlayerData.dex;
    const userModifier = userDex && Math.floor((userDex - 10) / 2);
    this.userModifier = userModifier ?? 0;
    const die = new Die(20);
    const roll = die.roll();
    const initiativeRollUser = (roll ?? 0) + this.userModifier;

    // enemy initiative
    let initiativeRollEnemy = 10;
    if (this.encounter && this.encounter.stats && this.encounter.stats.dex) {
      const enemyDex = this.encounter.stats.dex;
      const enemyModifier = Math.floor((enemyDex - 10) / 2);
      this.enemyModifier = enemyModifier ?? 0;
      const die = new Die(20);
      const roll = die.roll();
      initiativeRollEnemy = (roll ?? 0) + enemyModifier;
    }

    if (initiativeRollUser && initiativeRollEnemy) {
      // blocking clicks to let the die rolling sound play
      // and avoid overlapping with future sound effects
      this.updateRoundStatus(true);
      // this.playSoundEffect("die_roll");
      this.playSfx("diceRollSound");

      if (initiativeRollUser > initiativeRollEnemy) {
        this.userFirstToAttack = true;
        new Promise<void>((resolve, reject) => {
          this.setCombatLog(
            "<div className='lg:text-xl text-xs mb-1'><span style='color:#fbbf24'>D20 rolled!</span> You move first!</div>",
          );

          // resetting the sound effect to avoid overlapping with future sound effects
          setTimeout(() => {
            this.updateRoundStatus(false);
            resolve();
          }, 1000);
        });
        return;
      } else if (initiativeRollEnemy > initiativeRollUser) {
        this.userFirstToAttack = false;
        new Promise<void>((resolve, reject) => {
          this.setCombatLog(
            "<div className='lg:text-xl text-xs mb-1'><span style='color:#fbbf24'>D20 rolled!</span> The enemy will move first!</div>",
          );

          // resetting the sound effect to avoid overlapping with future sound effects
          setTimeout(() => {
            this.updateRoundStatus(false);
            resolve();
          }, 1000);
        });
        return;
      } else if (initiativeRollEnemy === initiativeRollUser) {
        this.handleIniative();
      }
    }
  }

  handleAttackRolls(AC: number, modifierValue: number) {
    const attackRoll =
      Math.floor(Math.random() * 20) + 1 + modifierValue + (AC - 10);
    const hit = AC > attackRoll ? false : true;
    return { hit: hit, roll: attackRoll };
  }

  calculatingAC() {
    //enemy AC
    if (!this.encounter) return;
    const enemyDex = this.encounter.stats ? this.encounter.stats.dex : 10;
    const enemyModifier = Math.floor((enemyDex - 10) / 2);
    const ac = (this.encounter.ac ?? 10) + enemyModifier;
    this.updateEnemy({ ac: ac });
  }

  calculateUserDmg(move: Moveset) {
    if (!move || !move.dmg) return;
    const dmgMax = move.dmg;
    const modifierValue = this.calcutateModifierValue(move)
    // console.log("modifier value = ", modifierValue)

    let finalDmg = Math.floor(Math.random() * dmgMax + 1 + (modifierValue ?? 0));
    return finalDmg;
  }

  calcutateModifierValue(move: Moveset) {
    const tempPlayerData = useCombatStore.getState().tempPlayerData;
    const user_class = tempPlayerData.user_class;
    const classData = characterPresets.classes.find(
      (n) => n.class === user_class,
    );
    if (!classData) return;

    //for magic spells mostly, the player use one of their main magic attributes (wis, int, cha) as modifier
    //for physical class, we pick the highest value of the three
    //for other non magic skill, we still use the same logic, the result remains the same
    const mainAttributeBasedOnClass = classData.mainAbility;
    let attr = move.modifier?.find((n) =>
      n.includes(mainAttributeBasedOnClass),
    );
    //if the player's main attribute is used for the spell
    if (attr) {
      const attrValue = tempPlayerData[attr as keyof Character] as number;
      const modifierValue = Math.floor((attrValue - 10) / 2);
      return modifierValue;
    } else {
      if (!move.modifier) return;
      const tempPlayerAttr = [];
      for (let m of move.modifier) {
        tempPlayerAttr.push(tempPlayerData[m as keyof Character] as number);
      };
      const maxValue = Math.max(...tempPlayerAttr); // highest attribute value;
      const modifierValue = Math.floor((maxValue - 10) / 2);
      return modifierValue;
    };
  };

  preparingCombat(currentChoice: Choice, resetNbOfTurn: (n: number) => void) {
    //resetting nb of turn if needed
    resetNbOfTurn(1);

    // creating a snapshot to reset in case of a game over
    this.playerDataBeforeCombat = { ...this.tempPlayerData };

    const movesetsSnapshot = useCombatStore.getState().tempMovesets;
    this.movesetsBeforeCombat = [...movesetsSnapshot];

    const inventorySnapshot = useCombatStore.getState().tempInventory ?? [];
    this.inventoryBeforeCombat = [...inventorySnapshot];

    // fetching current enemy data
    this.encounter = {
      ...this.createEnemy.fetchEnemyData(currentChoice.enemy_id),
    };

    if (!this.encounter) return;

    this.updateEnemy({ ...this.encounter });

    //setting up the pre-requisite of the fight
    this.handleIniative();
    this.calculatingAC();
  }

  async system(
    move: Moveset | Item,
    node: keyof Nodes | undefined,
    // setSoundEffect: (effect: string) => void,
  ) {
    // the main system is here
    // either the user or the enemy attack first based on the initiative
    // then we wait 1sec to add a realistic delay between the attacks
    // then the other player attacks
    // only then we unlock the attack options

    if (this.userFirstToAttack) {
      this.clearCombatLog("");
      await this.handleUserTurn(move, node);

      // if user win, we kill the running process
      if (this.fight_over) return;

      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
      await this.handleEnemyTurn(node);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      if (!this.fight_over) this.setNbOfTurn(1);
    } else {
      this.clearCombatLog("");
      await this.handleEnemyTurn(node);

      // if the user lose, we kill the running process
      if (this.fight_over) return;

      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
      await this.handleUserTurn(move, node);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      if (!this.fight_over) this.setNbOfTurn(1);
    }
  }

  async handleUserTurn(move: Moveset | Item, node: keyof Nodes | undefined) {
    return new Promise<void>(async (resolve) => {
      this.fight_over &&= false;
      if (!this.encounter || !this.encounter.hp) return;

      if (
        move.type !== "skill" &&
        move.type !== "basic_skill" &&
        move.type !== "weapon_skill"
      ) {
        await this.useItem(move);
        resolve();
      } else {
        const finalDmg = this.calculateUserDmg(move);

        //calculating modifier values for attack roll
        const tempPlayerData = useCombatStore.getState().tempPlayerData;
        const user_class = tempPlayerData.user_class;
        const classData = characterPresets.classes.find(
          (n) => n.class === user_class,
        );
        // console.log("classData = ", classData);
        const mainAttribute = classData?.mainAbility;
        if (!mainAttribute) return;

        let attr = (move as Moveset).modifier?.find((n) =>
          n.includes(mainAttribute),
        ) as keyof Character;
        const attrValue = !attr ? 10 : (tempPlayerData[attr] as number);
        const modifierValue = Math.floor((attrValue - 10) / 2);
        const attackRoll = this.handleAttackRolls(
          this.encounter.ac ?? 10,
          modifierValue,
        );

        if (!attackRoll.hit) {
          this.playSfx("missSound");
          const log = `
          <div className="lg:text-xl text-xs mb-1">
            You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
          </div>`;
          this.setCombatLog(log);
          resolve();
        } else {
          
          //cleaning the attack name sound and log
          const arr = move.name?.split(" ") ?? "";
          const sound = arr[0];
          let formattedAttackName = "";
          if (move.name !== "" && move.name) {
            formattedAttackName =
              move.name?.charAt(0).toLocaleUpperCase() + move.name.slice(1);
          }
          this.playSfx(sound + "Sound");
          const log = `
          <div className="lg:text-xl text-xs mb-1">
            You use <span style="color:#fbbf24">${formattedAttackName}</span> for <span style="color:#fbbf24">${finalDmg}</span> damage!
          </div>`;
          this.setCombatLog(log);
          this.encounter.hp = Math.floor(this.encounter.hp - (finalDmg ?? 0));
          this.updateEnemy({ hp: this.encounter.hp });

          // DEALING WITH THE FALLOUT : IF THE PLAYER WIN
          if (this.encounter.hp <= 0) {
            // prevent another turn from incrementing because the fight is over
            this.fight_over = true;
            // small delay
            await new Promise<void>((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            });
            // clearing log and nb of turn
            this.clearCombatLog("");
            this.resetNbOfTurn(1);

            // updating the user' stats

            // moving on to the victory node
            this.updateNode(`${node}_victory`);
            this.playMusic("victoryMusic");
            resolve();
          } else {
            resolve();
          }
        }
      }
    });
  }

  async handleEnemyTurn(node: keyof Nodes | undefined) {
    return new Promise<void>(async (resolve) => {
      // We extract all the attacks that can be used by the enemy
      if (!this.encounter) return;
      this.fight_over &&= false;

      const moves =
        this.encounter.movesets && Object.entries(this.encounter.movesets);

      if (moves && this.tempPlayerData.hp) {
        // we pick an attack at random : the name and the dmg done
        let [enemyAttack, enemyDmg] =
          moves[Math.floor(Math.random() * moves.length)];

        // we calculate the amount of dmg inflicted at random (dice roll)
        const enemyFinalDmg = Math.floor(Math.random() * enemyDmg) + 1;

        // we calculate if the enemy hit or miss
        const attackRoll = this.handleAttackRolls(
          this.tempPlayerData.ac ?? 10,
          this.enemyModifier,
        );

        if (!attackRoll.hit) {
          this.playSfx("missSound");
          const log = `<div className="lg:text-xl text-xs mb-1">
              The enemy missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})<br>
              </div>`;
          this.setCombatLog(log);
          setTimeout(() => {
            this.updateRoundStatus(false);
            resolve();
          }, 1000);
          resolve();
        } else {
          const soundName = enemyAttack + "Sound";
          this.playSfx(soundName);
          enemyAttack =
            enemyAttack.charAt(0).toLocaleUpperCase() + enemyAttack.slice(1);
          const log = `<div className="lg:text-xl text-xs mb-1">
            The enemy uses <span style="color:#fbbf24">${enemyAttack}</span> for <span style="color:#fbbf24">${enemyFinalDmg}</span> damage!
            </div>`;
          this.setCombatLog(log);

          // incrementing the total damage taken, we need to fetch the most recent
          //state object
          const tempPlayerData = useCombatStore.getState().tempPlayerData;
          tempPlayerData.damage_taken =
            tempPlayerData.damage_taken + enemyFinalDmg;

          let hpLeft;

          if (tempPlayerData.hp) {
            //prevent negative values
            if (tempPlayerData.damage_taken >= tempPlayerData.hp) {
              tempPlayerData.damage_taken = tempPlayerData.hp;
            }
            hpLeft = tempPlayerData.hp - tempPlayerData.damage_taken;
            this.updateTempPlayerData({
              damage_taken: tempPlayerData.damage_taken,
            });
          }

          // calculate the user's current virtual hp compared to total damage taken

          // GAME OVER
          if ((hpLeft ?? 0) <= 0) {
            // prevent another turn from incrementing because the fight is over
            this.fight_over = true;

            // adding a small delay
            await new Promise<void>((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            });
            // clearing log and nb of turn
            this.clearCombatLog("");

            // moving to the game over and restart node
            this.updateNode(`${node}_game_over`);
            this.playMusic("gameOverMusic");
            this.resetNbOfTurn(1);

            // resetting the user stats
            if (!this.playerDataBeforeCombat) return;
            this.updateTempPlayerData({
              damage_taken: this.playerDataBeforeCombat?.damage_taken,
            });
            if (
              this.inventoryBeforeCombat &&
              this.inventoryBeforeCombat.length > 0
            ) {
              useCombatStore
                .getState()
                .updateTempInventory([...this.inventoryBeforeCombat]);
            }
            if (this.movesetsBeforeCombat) {
              useCombatStore
                .getState()
                .updateTempMovesets([...this.movesetsBeforeCombat]);
            }

            resolve();
          } else {
            resolve();
          }
        }
      }
    });
  }

  async useItem(item: Item) {
    const itemToUse = new ItemClass(item, "combat");
    const feedback = await itemToUse.handler();
    let log;
    if (item.type === "consumable") {
      log = `
            <div className="lg:text-xl text-xs mb-1">
              You use <span style="color:#fbbf24">${item.name}</span> !
            </div>`;
    } else if (item.type === "weapon") {
      log = `
        <div className="lg:text-xl text-xs mb-1">
          You ${feedback?.action === "desequip" ? "desequip" : "equip"} <span style="color:#fbbf24">${item.name}</span> !
        </div>`;
    }
    this.setCombatLog(log ?? "");
  }
  
}
