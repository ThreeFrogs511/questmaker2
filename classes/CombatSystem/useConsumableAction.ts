import { useCombatStore } from "@/stores/useCombatStore";
import { Character, Moveset } from "@/types/types";


export default class useConsumableAction {
  private setCombatLog: (log: string) => void;
  private item;
  private tempPlayerData = useCombatStore.getState().tempPlayerData;

  constructor(item: Moveset) {
    this.setCombatLog = useCombatStore.getState().setCombatLog;
    this.item = item;
  }

  consumeHealthPotion() {
    let itemEffectValue;
    let text;
    if (this.tempPlayerData.damage_taken <= 0) {
      text = `You use <span style="color:yellow">${this.item.name}</span> but you already have full hitpoints !</span>`;
      itemEffectValue = null;
    } else {
      itemEffectValue = this.tempPlayerData.damage_taken - (this.item.value ?? 0);
      // if damage_taken<0, the potion restored all their hp
      if (itemEffectValue <= 0) {
        itemEffectValue = 0;
        text = `You use <span style="color:yellow">${this.item.name}</span> and gain all your hp back !`;
      } else {
        text = `You use <span style="color:yellow">${this.item.name}</span> for <span style="color:yellow">+${this.item.value}</span> hitpoints !`;
      }
    }
    const log = `
                <div className="lg:text-xl text-xs mb-1">
                ${text}
                </div>`;
    this.setCombatLog(log);
    return itemEffectValue;
  }
}
