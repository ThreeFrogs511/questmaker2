"use client";
import { Item as ItemType, Character, Moveset } from "@/types/types";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { updatePlayerDataAfterConsumableUse } from "@/lib/inventory/updatePlayerDataAfterConsumableUse";
import { updatePlayerDataAfterWeaponUse } from "@/lib/inventory/updatePlayerDataAfterWeaponUse";
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

  constructor(item: ItemType, mode="free", audio=new AudioManager()) {
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
      const r = this.hasWeaponBeenAlreadyEquipped();
      if (r) {
        const r = this.desequipWeapon();
        return {success:r, action:"desequip"};
      } else {
        const r = await this.equipWeapon();
        return {success:r, action:"equip"};
      }
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
        useCombatStore.getState().hydrateMovesets([...this.snapshotOfPreviousData.movesets]);
        useInventoryStore.getState().updateInventory([...this.snapshotOfPreviousData.inventory ?? []]);
        return false;
      };
    };
  };

  hasWeaponBeenAlreadyEquipped() {
    if (this.mode === "combat") {
      const tempMoveSets = useCombatStore.getState().tempMovesets;
      const skill = tempMoveSets.find(n => n.for?.includes(this.item?.slug ?? ""));
      if (skill) {
        return true;
      } else {
        return false;
      };

    } else if (this.mode === "free") {
      const movesets = useCombatStore.getState().movesets;
      const skill = movesets.find(n => n.for?.includes(this.item?.slug ?? ""));
      if (skill) {
        //
        return true;
      } else {
        //equip
        return false;
      }
    };
  };

  async equipWeapon() {
    if (this.mode === "combat" && this.item?.equipped === false) {
      const tempMoveSets = useCombatStore.getState().tempMovesets;
      const updateTempMovesets = useCombatStore.getState().updateTempMovesets;
      const newSkill:Moveset | undefined = movesets.find(n => n.for?.includes(this.item?.slug ?? ""))
      const character_id=useCharacterStore.getState().character.character_id
      if (!newSkill || !character_id) return;
      newSkill.is_skill_activated = true;

      const updatedTempMovesets:Moveset[] = tempMoveSets.map((n) => {
        if (n.type === "basic_skill" || n.type === "weapon_skill") {
          n = {...newSkill, character_id:character_id}
        }
        return n;
      });
      updateTempMovesets(updatedTempMovesets);
      const updatedTempInventory = useCombatStore.getState().tempInventory?.map((n) => {
        if (n.slug === this.item?.slug) {
          return {...n, equipped:true}
        } else {
          return n;
        }
      });
      useCombatStore.getState().updateTempInventory(updatedTempInventory ?? []);

    } else if (this.mode === "free" && this.item?.equipped === false) {
      const movesets = useCombatStore.getState().movesets;
      const hydrateMovesets = useCombatStore.getState().hydrateMovesets;
      const newSkill:Moveset | undefined = movesets.find(n => n.for?.includes(this.item?.slug ?? ""));
      const character_id=useCharacterStore.getState().character.character_id
      if (!newSkill || !character_id) return;
      newSkill.is_skill_activated = true;
      

      const updatedMovesets:Moveset[] = movesets.map((n) => {
        if (n.type === "basic_skill" || n.type === "weapon_skill") {
          n = {...newSkill, character_id:character_id}
        };
        return n;
      });
      hydrateMovesets(updatedMovesets);

      const updatedInventory = useInventoryStore.getState().inventory?.map((n) => {
        if (n.slug === this.item?.slug) {
          return {...n, equipped:true}
        } else {
          return n;
        };
      });
      useInventoryStore.getState().updateInventory(updatedInventory ?? []);

      const r = await this.persistNewChangeInDatabase();
      if (r) {
        this.determineWhichSoundToPlay();
        return true;
      } else {
        useCombatStore.getState().hydrateMovesets([...this.snapshotOfPreviousData.movesets]);
        useInventoryStore.getState().updateInventory([...this.snapshotOfPreviousData.inventory ?? []]);
        return false;
      }


    }
  };

  async desequipWeapon() {
    if (this.mode === "combat" && this.item?.equipped === true) {
      const tempMoveSets = useCombatStore.getState().tempMovesets;
      const tempPlayerData = useCombatStore.getState().tempPlayerData;
      const updateTempMovesets = useCombatStore.getState().updateTempMovesets;
      const replacementSkill = movesets.find(n => {
        if (tempPlayerData.race === "Felinois") {
          return n.name === "scratch";
        } else {
          return n.name ==="punch";
        }
      });
      if (!replacementSkill) return;
      const movesetsWithoutWeaponSkill:Moveset[] | undefined = tempMoveSets.map((n) => {
        if (n.type === "weapon_skill" && n.for?.includes(this.item?.slug ?? "")) {
          n = replacementSkill;
        }
        return n;
      });
      updateTempMovesets([...movesetsWithoutWeaponSkill]);
      const updatedTempInventory = useCombatStore.getState().tempInventory?.map((n) => {
        if (n.slug === this.item?.slug) {
          return {...n, equipped:false}
        } else {
          return n;
        }
      })
      useCombatStore.getState().updateTempInventory(updatedTempInventory ?? []);


    } else if (this.mode === "free" && this.item?.equipped === true) {
      const character = useCharacterStore.getState().character
      const movesets = useCombatStore.getState().movesets;
      const hydrateMovesets = useCombatStore.getState().hydrateMovesets;
      const replacementSkill = movesets.find(n => {
        if (character.race === "Felinois") {
          return n.name === "scratch";
        } else {
          return n.name ==="punch";
        }
      });
      if (!replacementSkill) return;
      const movesetsWithoutWeaponSkill:Moveset[] | undefined = movesets.map((n) => {
        if (n.type === "weapon_skill" && n.for?.includes(this.item?.slug ?? "")) {
          n = replacementSkill;
        }
        return n;
      });
      hydrateMovesets([...movesetsWithoutWeaponSkill]);
      const updatedInventory = useCombatStore.getState().tempInventory?.map((n) => {
        if (n.slug === this.item?.slug) {
          return {...n, equipped:false}
        } else {
          return n;
        }
      })
      useCombatStore.getState().updateTempInventory([...updatedInventory ?? []]);

      const r = await this.persistNewChangeInDatabase();
      if (r) {
        this.determineWhichSoundToPlay();
        return true;
      } else {
        useCombatStore.getState().hydrateMovesets([...this.snapshotOfPreviousData.movesets]);
        useInventoryStore.getState().updateInventory([...this.snapshotOfPreviousData.inventory ?? []]);
        return false;
      }


    }
  };

  determineWhichSoundToPlay() {
    if (this.item?.family?.includes("potion")) {
      this.audio.playSfx("potionSound")
    } else if (this.item?.type === "weapon") {
      //play equip weapon sound
    }
  };

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
  };

  async persistNewChangeInDatabase() {
    if (this.mode === "free" && this.item) {
      if (this.item?.type === "consumable") {
        const feedback = await updatePlayerDataAfterConsumableUse(this.item);
        if (feedback.err) {
          console.log("error:", feedback.err);
          return false;
        } else if (feedback.success) {
          console.log(feedback)
          return true;
        };
      } else if (this.item?.type === "weapon") {
        const feedback = await updatePlayerDataAfterWeaponUse(this.item, useCharacterStore.getState().character);
        if (feedback.err) {
          console.log("error:", feedback.err);
          return false;
        } else if (feedback.success) {
          console.log(feedback)
          return true;
        };
      }
    }
  };

  getSnapshotPlayerData() {
    return this.snapshotOfPreviousData;
  };
}
