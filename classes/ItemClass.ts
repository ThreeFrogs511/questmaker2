"use client";
import { Item as ItemType, Character, Moveset } from "@/types/types";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { updatePlayerDataAfterConsumableUse } from "@/lib/inventory/updatePlayerDataAfterConsumableUse";
import AudioManager from "./AudioManager";
import movesets from '@/assets/movesets.json'

export default class ItemClass {
  private mode: string | undefined;
  private item: ItemType | undefined;
  private snapshotOfPreviousData: {
    character: Character;
    inventory: ItemType[];
    movesets: Moveset[];
  };
  private audio: AudioManager

  constructor(item: ItemType, mode = "free", audio=new AudioManager()) {
    this.mode = mode;
    this.item = item;
    this.snapshotOfPreviousData = {
      character: useCharacterStore.getState().character,
      inventory: useInventoryStore.getState().inventory ?? [],
      movesets: useCombatStore.getState().movesets,
    };
    this.audio = audio;
  }

  async handler() {
    if (this.item?.type === "consumable") {
        const r = await this.useConsumable();
        return {success:r}
    } else if (this.item?.type === "weapon") {
      this.equipWeapon();
      //equipe weapon method
    } else if (this.item?.type === "armor") {
      //equipe armor method
    }
  }

  async useConsumable() {
    if (this.mode === "combat") {
        const tempCharacter = useCombatStore.getState().tempPlayerData;
        const updateTempCharacter = useCombatStore.getState().updateTempPlayerData;
        const target = this.item?.effectTarget as keyof Character;
        let newValue;
        if (this.item?.effectType === "reduce") {
        newValue =
            Number(tempCharacter[target]) - (this.item?.effectValue ?? 0);
        newValue = newValue <0 ? 0 : newValue;
        } else if (this.item?.effectType === "increase") {
        newValue =
            Number(tempCharacter[target]) + (this.item?.effectValue ?? 0);
        };
        updateTempCharacter({ [target]: newValue });
        this.decrementInventoryAfterUse();
        this.determineWhichSoundToPlay();   


    } else if (this.mode === "free") {
      const character = useCharacterStore.getState().character;
      const updateCharacter = useCharacterStore.getState().updateCharacter;
      const target = this.item?.effectTarget as keyof Character;
      let newValue;
      if (this.item?.effectType === "reduce") {
        newValue = Number(character[target]) - (this.item?.effectValue ?? 0);
        newValue = newValue <0 ? 0 : newValue;
      } else if (this.item?.effectType === "increase") {
        newValue = Number(character[target]) + (this.item?.effectValue ?? 0);
      };
      //optimistic ui logic here
      updateCharacter({ [target]: newValue });
      this.decrementInventoryAfterUse();
      const r = await this.persistNewChangeInDatabase();
      if (r === true) {
        this.determineWhichSoundToPlay();
        return true;
      } else if (r === false) {
        updateCharacter({...this.snapshotOfPreviousData.character});
        useCombatStore.getState().hydrateMovesets({...this.snapshotOfPreviousData.movesets});
        useInventoryStore.getState().updateInventory({...this.snapshotOfPreviousData.inventory ?? []});
        return false;
      };
    };
  };

  equipWeapon() {
    if (this.mode === "combat") {
      const tempMoveSets = useCombatStore.getState().tempMovesets;
      const updateTempMovesets = useCombatStore.getState().updateTempMovesets;
      const newSkill:Moveset | undefined = movesets.find(n => n.for?.includes(this.item?.slug ?? ""))
      if (!newSkill) {
        return;
      } 
      newSkill.is_skill_activated = true;
      const updatedTempMovesets = tempMoveSets.map((n) => {
        if (n.type === "basic_skill" || n.type === "weapon_skill") {
          n = newSkill
        }
        return n;
      });
      console.log(updatedTempMovesets)
      updateTempMovesets(updatedTempMovesets);
    } else if (this.mode === "free") {
      const movesets = useCombatStore.getState().movesets;
      const hydrateMovesets = useCombatStore.getState().hydrateMovesets;
      const updatedMovesets = movesets.map((n) => {
        if (n.type === "basic_skill" || n.type === "weapon") {
          const newSkill = movesets.filter(n => n.for?.includes(this.item?.slug ?? ""));
          if (!newSkill) {
            //error
          }

          n = {
            //attack
          };
        }
        return n;
      });
      hydrateMovesets(updatedMovesets);
    }
  }

  determineWhichSoundToPlay() {
    if (this.item?.family?.includes("potion")) {
      this.audio.playSfx("potionSound")
    } else if (this.item?.type === "weapon") {
      //play equip weapon sound
    }
  }

  decrementInventoryAfterUse() {
    if (this.mode === "combat") {
      const tempInventory = useCombatStore.getState().tempInventory;
      const hydrateTempInventory =
        useCombatStore.getState().updateTempInventory;
      const updatedTempInventory = tempInventory
        ?.map((n) => {
          if (n.slug === this.item?.slug) {
            n.quantity = (n.quantity ?? 0) - 1;
          }
          return n;
        })
        .filter((n) => (n.quantity ?? 0) > 0);
      hydrateTempInventory(updatedTempInventory ?? []);
    } else if (this.mode === "free") {
      const inventory = useInventoryStore.getState().inventory;
      const hydrateInventory = useInventoryStore.getState().updateInventory;
      const updatedInventory = inventory
        ?.map((n) => {
          if (n.slug === this.item?.slug) {
            n.quantity = (n.quantity ?? 0) - 1;
          }
          return n;
        })
        .filter((n) => (n.quantity ?? 0) > 0);
      hydrateInventory(updatedInventory ?? []);
    }
  }

  async persistNewChangeInDatabase() {
    if (this.mode === "free" && this.item?.type === "consumable" && this.item) {
      const feedback = await updatePlayerDataAfterConsumableUse(this.item);
      if (feedback.err) {
        console.log("error:", feedback.err);
        return false;
      } else if (feedback.success) {
        console.log(feedback)
        return true;
      }
    }
  }

  getSnapshotPlayerData() {
    return this.snapshotOfPreviousData;
  };
}
