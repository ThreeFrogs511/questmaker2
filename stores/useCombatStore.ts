import { create } from 'zustand'
import { Encounter } from '@/types/types'

type useCombatStore = {
    combatLog: string 
    setCombatLog : (patch: Partial<string | null>) => void
    clearCombatLog: (combatLog: string) => void

    enemy: Encounter | undefined
    updateEnemy: (patch: Partial<Encounter | undefined>) => void

    isCombatOn: boolean
    setCombat: (isCombatOn: boolean) => void,

    hasRoundStarted: boolean,
    updateRoundStatus : ( hasRoundStarted: boolean) => void

    nbOfTurn : number
    setNbOfTurn : (patch: Partial<number>) => void
    clearNbOfTurn :(nbOfTurn: number) => void

    menu: string
    menuNavigation: (menu : string) => void
}


export const useCombatStore = create<useCombatStore>((set) => ({
    combatLog:'',
    setCombatLog: (text) =>
        set(state => ({
            combatLog: state.combatLog + text
    })),
    clearCombatLog: () => set({combatLog:''}),
    enemy: undefined,
    updateEnemy: (patch) =>
    set(state => ({
        enemy: {
        ...state.enemy,
        ...patch,
        },
    })),
    isCombatOn:false,
    setCombat: (bool) => set(({isCombatOn: bool})),
    hasRoundStarted:false,
    updateRoundStatus: (bool) => set(({hasRoundStarted:bool})),
    nbOfTurn: 1,
    setNbOfTurn : () => set(state => ({nbOfTurn : state.nbOfTurn + 1})),
    clearNbOfTurn: (number) => set(({nbOfTurn:number})),
    menu: '',
    menuNavigation : (string) => set({menu:string})

}))