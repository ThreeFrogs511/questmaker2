import { create } from 'zustand'
import { ListType } from "@/types/types";

type UseJournalStore = {
    allQuests: Array<ListType> | null;
    setAllQuests: (q: Array<ListType>) => void;
    displayedQuests : Array<ListType> | null;
    setDisplayedQuests : (dq : Array<ListType>) => void;
    whichPage : number;
    setWhichPage : (delta: number) => void;
    journalError: string;
    setJournalError : (err:string) => void;
}


export const useJournalStore = create<UseJournalStore>((set) => ({
    allQuests: null,
    displayedQuests: null,
    whichPage:0,
    setAllQuests : (q) => set({allQuests : q}),
    setDisplayedQuests : (dq) => set({displayedQuests: dq}),
    setWhichPage: (delta) => set((s) => ({whichPage: s.whichPage + delta})),
    journalError:'',
    setJournalError : (err) => set({journalError:err})
}));