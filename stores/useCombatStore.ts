import { create } from "zustand";
import { Encounter, Moveset, Character } from "@/types/types";

type useCombatStore = {
  combatLog: string;
  setCombatLog: (patch: Partial<string | null>) => void;
  clearCombatLog: (combatLog: string) => void;

  enemy: Encounter | undefined;
  updateEnemy: (patch: Partial<Encounter | undefined>) => void;

  isCombatOn: boolean;
  setCombat: (isCombatOn: boolean) => void;

  hasRoundStarted: boolean;
  updateRoundStatus: (hasRoundStarted: boolean) => void;

  nbOfTurn: number;
  setNbOfTurn: (patch: Partial<number>) => void;
  resetNbOfTurn: (nbOfTurn: number) => void;

  menu: string;
  menuNavigation: (menu: string) => void;

  isInventoryOpened: boolean;
  openInventory: (isInventoryOpened: boolean) => void;
  playSoundEffect: (soundPath: string) => void;
  soundEffect: string;

  movesets:Moveset[] | [];
  hydrateMovesets : (movesets:Moveset[]) => void;

  tempPlayerData: Character;
  updateTempPlayerData: (patch: Partial<Character>) => void;
  hydrateTempPlayerData : (data:Character) => void;

  resetMovesets : ([]) => void
  resetAll: () => void;
};

export const useCombatStore = create<useCombatStore>((set) => ({
  combatLog: "",
  setCombatLog: (text) =>
    set((state) => ({
      combatLog: state.combatLog + text,
    })),
  clearCombatLog: () => set({ combatLog: "" }),

  enemy: undefined,
  updateEnemy: (patch) =>
    set((state) => ({
      enemy: {
        ...state.enemy,
        ...patch,
      },
    })),

    

  isCombatOn: false,
  setCombat: (bool) => set({ isCombatOn: bool }),
  
  hasRoundStarted: false,
  updateRoundStatus: (bool) => set({ hasRoundStarted: bool }),
  nbOfTurn: 1,
  setNbOfTurn: () => set((state) => ({ nbOfTurn: state.nbOfTurn + 1 })),
  resetNbOfTurn: (number) => set({ nbOfTurn: number }),

  menu: "",
  menuNavigation: (string) => set({ menu: string }),

  isInventoryOpened: false,
  openInventory: (bool) => set({ isInventoryOpened: bool }),
  soundEffect: "",
  playSoundEffect: (string) => set({ soundEffect: string }),

  movesets: [],
  hydrateMovesets : (movesets) => set({movesets:movesets}),

    tempPlayerData: {
    character_id: null,
    username: null,
    xp: null,
    hp: null,
    dopamine: null,
    dopamine_consumed: 0,
    gender: null,
    user_class: null,
    race: null,
    lvl: null,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    ac: null,
    damage_taken: 0,
    coins: 0,
  },

  updateTempPlayerData: (patch) =>
  set((state) => {
    return {
      tempPlayerData: {
        ...state.tempPlayerData,
        ...patch,
      },
    };
  }),

  hydrateTempPlayerData : (data) => set({tempPlayerData:data}),
  resetMovesets : () => set({movesets:[]}),

  resetAll: () => set(({
    tempPlayerData:    
    {character_id: null,
    username: null,
    xp: null,
    hp: null,
    dopamine: null,
    dopamine_consumed: 0,
    gender: null,
    user_class: null,
    race: null,
    lvl: null,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    ac: null,
    damage_taken: 0,
    coins: 0},
    combatLog:"",
    enemy:undefined,
    isCombatOn:false,
    hasRoundStarted:false,
    nbOfTurn:1,
    menu:"",
    isInventoryOpened:false,
    soundEffect:""
  }))
}));
