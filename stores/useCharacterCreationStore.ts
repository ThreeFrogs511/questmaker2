import { create } from 'zustand'


type Draft = {
id: number | null,
username: string | null,
email: string | null,
hp: number | null,
xp: number | null,
dopamine: number | null,
dopamine_consumed:number,
gender: string | null
user_class : string | null,
race: string | null,
lvl : number | null,
str : number | null,
dex : number | null,
con : number | null,
int : number | null,
wis : number | null,
cha : number | null,
ac: number | null,
profile_completed : boolean,
damage_taken: number
coins: number
}
   

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
