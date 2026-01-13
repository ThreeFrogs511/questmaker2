import { useCombatStore } from "@/stores/useCombatStore";

export default class useAttackAction {

  private setCombatLog:any;
  private attack;
  private setSoundEffect;
  private enemyAC;

  constructor(item:any, setSoundEffect:any, enemyAC:number) {
      this.setCombatLog = useCombatStore.getState().setCombatLog;
      this.attack = item;
      this.setSoundEffect = setSoundEffect;
      this.enemyAC=enemyAC;
  };

  calculateAttackModifier() {
    // 
  };

  calculateAttackRolls(AC:number) {
    let attackRoll = Math.floor(Math.random() * 20)+1+(AC-10);
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
      this.setSoundEffect('user_miss')
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You missed! (Roll: ${attackRoll.roll <= 0 ? 1 : attackRoll.roll})
      </div>`;
      this.setCombatLog(log);
      return null;
    } else {
      this.setSoundEffect(this.attack.text);
      const log = `
      <div className="lg:text-xl text-xs mb-1">
        You use <span style="color:yellow">${this.attack.text}</span> for <span style="color:yellow">${finalDmg}</span> damage!
      </div>`;
      this.setCombatLog(log);
      return finalDmg;
    }
  }
}