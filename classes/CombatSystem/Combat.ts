import { Moveset, Nodes, Character, Encounter, Choice, Item } from "@/types/types";
import Enemy from "./Enemy";
import useAttackAction from "./useAttackAction";
import useConsumableAction from "./useConsumableAction";
import { useCombatStore } from "@/stores/useCombatStore";
import { useNarrationStore } from "@/stores/useNarrationStore";
import Die from "./Die";

export default class Combat {
  //user's attributes
  // private currentUser;
  // private updateStats;
  private playerDataBeforeCombat: Character | undefined;
  private movesetsBeforeCombat : Moveset[] | undefined;
  private inventoryBeforeCombat: Item[] | undefined;

  private userModifier: number;
  private userFirstToAttack: boolean;
  private useAttack: useAttackAction | undefined;

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
    this.useAttack = undefined;

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
    // const userDex = this.currentUser.dex;
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

  handleAttackRolls(AC: number, modifier: number) {
    const attackRoll =
      Math.floor(Math.random() * 20) + 1 + modifier + (AC - 10);
    const hit = AC > attackRoll ? false : true;
    return { hit: hit, roll: attackRoll };
  }

  // AC = determine the probability of avoiding enemy's attacks
  calculatingAC() {
    //enemy AC
    if (!this.encounter) return;
    const enemyDex = this.encounter.stats ? this.encounter.stats.dex : 10;
    const enemyModifier = Math.floor((enemyDex - 10) / 2);
    const ac = 10 + enemyModifier;
    this.updateEnemy({ ac: ac });
  }

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

      if (move.type !== "skill" && move.type !== "basic_skill") {
        this.useItem(move);
      } else {
        this.useAttack = new useAttackAction(
          move as Moveset,
          this.encounter.ac ?? 10,
          this.playSfx,
        );
        const damageDoneByUser = await this.useAttack.resolver();
        if (!damageDoneByUser) {
          resolve();
          return;
        }

        this.encounter.hp = Math.floor(
          this.encounter.hp - (damageDoneByUser ?? 0),
        );
        this.updateEnemy({ hp: this.encounter.hp });
      }

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

          // incrementing the total damage taken
          this.tempPlayerData.damage_taken =
            this.tempPlayerData.damage_taken + enemyFinalDmg;

          //prevent the damage from being superior to the hp in order to avoid negative values
          this.tempPlayerData.damage_taken >= this.tempPlayerData.hp &&
            (this.tempPlayerData.damage_taken = this.tempPlayerData.hp);

          // calculate the user's current virtual hp compared to total damage taken
          const hpLeft =
            this.tempPlayerData.hp - this.tempPlayerData.damage_taken;

          // updating the real state to update the hp bar in the combatInterface component
          this.updateTempPlayerData({
            damage_taken: this.tempPlayerData.damage_taken,
          });


          // GAME OVER
          if (hpLeft <= 0) {
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
            this.resetNbOfTurn(1);

            // resetting the user stats and enemy
            if (!this.playerDataBeforeCombat) return;
            this.updateTempPlayerData({
              damage_taken: this.playerDataBeforeCombat?.damage_taken,
            });
            if (this.inventoryBeforeCombat && this.inventoryBeforeCombat.length > 0) {
              useCombatStore.getState().updateTempInventory([...this.inventoryBeforeCombat])
            };
            if (this.movesetsBeforeCombat) {
              useCombatStore.getState().updateTempMovesets([...this.movesetsBeforeCombat])
            }


            resolve();
          } else {
            resolve();
          }
        }
      }
    });
  }


  useItem(item: Item) {
    if (item.type === "consumable") {
      const userAction = new useConsumableAction(item, this.playSfx);
      const itemTarget = item.effectTarget;
      switch (itemTarget) {
        case "damage_taken":
          const damageRemoved = userAction.consumeHealthPotion();
          if (damageRemoved === null || damageRemoved === undefined) return;
          this.tempPlayerData.damage_taken = damageRemoved;
          this.updateTempPlayerData({
            damage_taken: this.tempPlayerData.damage_taken,
          });
          break;

        default:
          break;
      }
      // the user equips a new weapon
    } else if (item.type === "weapon") {
      const tempMovesets = useCombatStore.getState().tempMovesets;
      const updateMovesets = useCombatStore.getState().updateTempMovesets;
      const decrementTempInventory =
        useCombatStore.getState().decrementTempInventory;
      const newMove = {
        dmg: 10,
        dopamine_required: 0,
        lvl_required: 1,
        modifier: "dex",
        name: "slash",
        type: "basic_skill",
      };
      tempMovesets.splice(1, 1, newMove);
      updateMovesets([...tempMovesets]);
      decrementTempInventory("hunting-knife");
      const log = `<div className="lg:text-xl text-xs mb-1">
            You equip <span style="color:#fbbf24">${item.name}</span> !
            </div>`;
      this.setCombatLog(log);
    }
  }
}
