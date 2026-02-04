import { create } from 'zustand'
import { User } from '@/types/types'

type UserStore = {
  currentUser: User
  login: (user: User) => void
  logout: () => void
  updateProfile: (patch: Partial<User>) => void
  updateStats: (patch: Partial<User>) => void
  addXp: (delta: number) => void
  addDamage: (delta: number) => void
  attacks: object
  fetchSelectedAttacks: (attacks:object) => void
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: {
        id: null, 
        username:null, 
        email:null, 
        xp:null, 
        hp:null, 
        dopamine: null,
        dopamine_consumed: 0,
        gender: null,
        user_class:null, 
        race:null,
        lvl:null,
        str :10,
        dex :10,
        con :10,
        int :10,
        wis :10,
        cha :10,
        ac:null,
        profile_completed: false,
        damage_taken:0,
        coins:0
    },

  login: (user) =>
    set({ currentUser: user }),

  logout: () =>
    set({ currentUser: {
        id: null, 
        username:null, 
        email:null, 
        xp:null, 
        hp:null, 
        dopamine: null,
        dopamine_consumed: 0,
        gender: null,
        user_class:null, 
        race:null,
        lvl:null,
        str :10,
        dex :10,
        con :10,
        int :10,
        wis :10,
        cha :10,
        ac:null,
        profile_completed: false,
        damage_taken:0,
        coins:0
    } }),

  updateProfile: (patch) =>
    set((state) => {
      if (!state.currentUser) return state
      return {
        currentUser: {
          ...state.currentUser,
          ...patch,
        },
      }
    }),

  updateStats: (patch) =>
    set((state) => {
      if (!state.currentUser) return state
      return {
        currentUser: {
          ...state.currentUser,
          ...patch,
        },
      }
    }),

    addXp: (delta) => 
      set((state) => {
        if (!state.currentUser) return state
        return {
          currentUser: {
            ...state.currentUser,
            xp: (state.currentUser.xp ?? 0) + delta
          }
        }
      }), 

    addDamage: (delta) => 
      set((state) => {
        if (!state.currentUser) return state
        return {
          currentUser: {
            ...state.currentUser,
            damage_taken: (state.currentUser.damage_taken ?? 0) + delta
          }
        }
      }), 
    attacks:{},
    fetchSelectedAttacks : (object) => set(({attacks:object}))
}))
