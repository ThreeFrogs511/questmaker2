import { useCombatStore } from "@/stores/useCombatStore";
import { Moveset } from "@/types/types";

export default class useAttackAction {

  private setCombatLog: (log: string) => void;
  private attack;
  private playSoundEffect;
  private enemyAC;
  private playSfx;
  private updateRoundStatus: (boolean: boolean) => void;

  constructor(item: Moveset, enemyAC: number, playSfx:(sound:string)=>void) {
      this.playSfx=playSfx;
      this.setCombatLog = useCombatStore.getState().setCombatLog;
      this.attack = item;
      this.playSoundEffect = useCombatStore.getState().playSoundEffect;
      this.enemyAC=enemyAC;
      this.updateRoundStatus = useCombatStore.getState().updateRoundStatus;

  };

  calculateAttackModifier() {
    // 
  };

  calculateAttackRolls(AC:number) {
    const attackRoll = Math.floor(Math.random() * 20)+1+(AC-10);
    const hit = AC>attackRoll ? false : true;
    return {hit:hit, roll:attackRoll};
  };

  calculateDmg() {
      const dmgMax = this.attack.dmg;
      let finalDmg;
      if (dmgMax) {
          finalDmg = Math.floor(Math.random() * dmgMax)+1;
          return finalDmg;
      }
  };

  async resolver() {
    const finalDmg = this.calculateDmg();
    if (!finalDmg) return;
    const attackRoll = this.calculateAttackRolls(this.enemyAC ?? 10);

    if (!attackRoll.hit) {
      this.playSfx("missSound")
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
      </div>`;
      this.setCombatLog(log);
      return null;
    } else {
      const sound = this.attack.name ?? "";
      let formattedAttackName="";
      if (this.attack.name !== "" && this.attack.name) {
      formattedAttackName = this.attack.name?.charAt(0).toLocaleUpperCase() + this.attack.name.slice(1)
      }
      console.log(formattedAttackName)
      this.playSfx(sound+"Sound");
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You use <span style="color:#fbbf24">${formattedAttackName}</span> for <span style="color:#fbbf24">${finalDmg}</span> damage!
      </div>`;
      this.setCombatLog(log);
   
      return finalDmg;
    }
  }
}