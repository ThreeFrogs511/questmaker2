import { create } from "zustand";
import { Draft } from "@/types/types";
import { Attributes } from "@/types/types";

type CharacterCreationStore = {
  draft: Draft;
  updateDraft: (patch: Partial<Draft>) => void;
  resetDraft: (patch: Partial<Draft>) => void;
  abilityScores: Attributes;
  addPoint: (patch: keyof Attributes) => void;
  removePoint: (patch: keyof Attributes) => void;
  setAbilityScores: (abilities: Attributes) => void;
  pointsToSpare: number;
  setPointsToSpare: (delta: number) => void;
  resetPointsToSpare: (points:number) => void;
};

export const useCharacterCreationStore = create<CharacterCreationStore>(
  (set) => ({
    draft: {
      id: null,
      username: null,
      email: null,
      hp: null,
      xp: null,
      dopamine: null,
      dopamine_consumed: 0,
      gender: null,
      user_class: null,
      race: null,
      lvl: null,
      str: null,
      dex: null,
      con: null,
      int: null,
      wis: null,
      cha: null,
      ac: null,
      profile_completed: false,
      damage_taken: 0,
      coins: 0,
      last_campaign_done: null,
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

    resetDraft: () =>
      set({
        draft: {
          id: null,
          username: null,
          email: null,
          hp: null,
          xp: null,
          dopamine: null,
          dopamine_consumed: 0,
          gender: null,
          user_class: null,
          race: null,
          lvl: null,
          str: null,
          dex: null,
          con: null,
          int: null,
          wis: null,
          cha: null,
          ac: null,
          profile_completed: false,
          damage_taken: 0,
          coins: 0,
          last_campaign_done: null,
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

  }),
);
