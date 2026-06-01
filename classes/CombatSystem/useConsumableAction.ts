import { useCombatStore } from "@/stores/useCombatStore";
import { Item } from "@/types/types";

export default class useConsumableAction {
  private setCombatLog: (log: string) => void;
  private item;
  private tempPlayerData = useCombatStore.getState().tempPlayerData;
  private playSfx:(arg:string)=>void;

  constructor(item: Item, playSfx:(arg:string) => void) {
    this.setCombatLog = useCombatStore.getState().setCombatLog;
    this.item = item;
    this.playSfx=playSfx;

  }

  consumeHealthPotion() {
    let itemEffectValue;
    let text;
    if (this.tempPlayerData.damage_taken <= 0) {
      text = `You use <span style="color:#fbbf24">${this.item.name}</span> but you already have full hitpoints !</span>`;
      itemEffectValue = null;
    } else {
      this.playSfx("potionSound");
      itemEffectValue =
        this.tempPlayerData.damage_taken - (this.item.effectValue ?? 0);

      // if damage_taken<0, the potion restored all their hp
      if (itemEffectValue <= 0) {
        itemEffectValue = 0;
        text = `You use <span style="color:#fbbf24">${this.item.name}</span> and gain all your hp back !`;
      } else {
        text = `You use <span style="color:#fbbf24">${this.item.name}</span> for <span style="color:#fbbf24">+${this.item.effectValue}</span> hitpoints !`;
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
