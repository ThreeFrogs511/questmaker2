import { create } from 'zustand'
import { User } from '@/types/types'

type CharacterCreationStore = {
  draft: Partial<User>
  updateDraft: (patch: Partial<User>) => void
  resetDraft: (patch: Partial<User>) => void
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
