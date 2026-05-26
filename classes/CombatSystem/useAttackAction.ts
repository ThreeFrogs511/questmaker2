import { useCombatStore } from "@/stores/useCombatStore";
import { CombatAttackItem } from "@/types/types";

export default class useAttackAction {

  private setCombatLog: (log: string) => void;
  private attack;
  private playSoundEffect;
  private enemyAC;
  private playSfx;

  constructor(item: CombatAttackItem, enemyAC: number, playSfx:(sound:string)=>void) {
      this.playSfx=playSfx;
      this.setCombatLog = useCombatStore.getState().setCombatLog;
      this.attack = item;
      this.playSoundEffect = useCombatStore.getState().playSoundEffect;
      this.enemyAC=enemyAC;
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
      const dmgMax = this.attack.userDmg;
      let finalDmg;
      if (dmgMax) {
          finalDmg = Math.floor(Math.random() * dmgMax)+1;
          return finalDmg;
      }
  };

  resolver() {
    const finalDmg = this.calculateDmg();
    if (!finalDmg) return;
    const attackRoll = this.calculateAttackRolls(this.enemyAC ?? 10);

    if (!attackRoll.hit) {
      this.playSfx("missSound")
      // this.playSoundEffect('user_miss')
      // new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)).then(() => {
      //   this.playSoundEffect("");    
      // });
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
      </div>`;
      this.setCombatLog(log);
      return null;
    } else {
      const sound = this.attack.text ?? ""
      this.playSfx(sound+"Sound");
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You use <span style="color:yellow">${this.attack.text}</span> for <span style="color:yellow">${finalDmg}</span> damage!
      </div>`;
      this.setCombatLog(log);
      return finalDmg;
    }
  }
}