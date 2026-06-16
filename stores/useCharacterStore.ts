import { create } from "zustand";
import { Character, Attributes, Draft } from "@/types/types";

type CharacterCreationStore = {
  character: Character;
  draft: Draft;
  updateDraft: (
    draft: Partial<Character>,
  ) => void;
  hydrateCharacter: (character: Character) => void;
  updateCharacter: (patch: Partial<Character>) => void;
  resetCharacter: (patch: Partial<Character>) => void;
  abilityScores: Attributes;
  addPoint: (patch: keyof Attributes) => void;
  removePoint: (patch: keyof Attributes) => void;
  setAbilityScores: (abilities: Attributes) => void;
  pointsToSpare: number;
  setPointsToSpare: (delta: number) => void;
  resetPointsToSpare: (points: number) => void;
  updateStats: (patch: Partial<Character>) => void;
  addXp: (delta: number) => void;
  addDamage: (delta: number) => void;
};

export const useCharacterStore = create<CharacterCreationStore>((set) => ({
  character: {
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
  draft: {
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
  updateDraft: (patch) =>
    set((state) => {
      return {
        draft: {
          ...state.draft,
          ...patch,
        },
      };
    }),

  hydrateCharacter: (character) => set({ character: character }),

  updateCharacter: (patch) =>
    set((state) => {
      return {
        character: {
          ...state.character,
          ...patch,
        },
      };
    }),

  resetCharacter: () =>
    set({
      character: {
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
    }),

  abilityScores: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },

  addPoint: (patch) => {
    set((state) => {
      return {
        abilityScores: {
          ...state.abilityScores,
          [patch]: state.abilityScores[patch] + 1,
        },
      };
    });
  },

  removePoint: (patch) => {
    set((state) => {
      return {
        abilityScores: {
          ...state.abilityScores,
          [patch]: state.abilityScores[patch] - 1,
        },
      };
    });
  },

  setAbilityScores: (abilities) => set({ abilityScores: abilities }),

  pointsToSpare: 5,

  setPointsToSpare: (delta) =>
    set((state) => {
      return { pointsToSpare: state.pointsToSpare + delta };
    }),
  resetPointsToSpare: (points) => set({ pointsToSpare: points }),
  updateStats: (patch) =>
    set((state) => {
      if (!state.character) return state;
      return {
        character: {
          ...state.character,
          ...patch,
        },
      };
    }),

  addXp: (delta) =>
    set((state) => {
      if (!state.character) return state;
      return {
        character: {
          ...state.character,
          xp: (state.character.xp ?? 0) + delta,
        },
      };
    }),

  addDamage: (delta) =>
    set((state) => {
      if (!state.character) return state;
      return {
        character: {
          ...state.character,
          damage_taken: (state.character.damage_taken ?? 0) + delta,
        },
      };
    }),
}));
