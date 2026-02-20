import { create } from 'zustand'
import { Draft } from '@/types/types'



type CharacterCreationStore = {
  draft: Partial<Draft>
  updateDraft: (patch: Partial<Draft>) => void
  resetDraft: (patch: Partial<Draft>) => void
}

export const useCharacterCreationStore = create<CharacterCreationStore>((set) => ({
  draft: {},

  updateDraft: (patch) =>
    set((state) => {
      return {
        draft: {
          ...state.draft,
          ...patch,
        },
      }
    }),

   resetDraft: () => set({ draft: {} })
}))
