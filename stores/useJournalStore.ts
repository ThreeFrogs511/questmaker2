import { create } from 'zustand'
import { ListType } from "@/types/types";

type UseJournalStore = {
    allQuests: Array<ListType> | null;
    setAllQuests: (q: Array<ListType>) => void;
    displayedQuests : Array<ListType> | null;
    setDisplayedQuests : (dq : Array<ListType>) => void;
    whichPage : number;
    setWhichPage : (delta: number) => void;
    resetPage: (p: number) => void;
    journalError: string;
    setJournalError : (err:string) => void;
    addNewQuest : (nq : ListType) => void;
}


export const useJournalStore = create<UseJournalStore>((set) => ({
    allQuests: null,
    displayedQuests: null,
    whichPage:2,
    setAllQuests : (q) => set({allQuests : q}),
    setDisplayedQuests : (dq) => set({displayedQuests: dq}),
    setWhichPage: (delta) => set((s) => ({whichPage: s.whichPage + delta})),
    resetPage : (n) => set({whichPage:n}),
    journalError:'',
    setJournalError : (err) => set({journalError:err}),
    addNewQuest: (nq) => set((s) => {
        if (!s.allQuests) return s;
        return {
            allQuests: s.allQuests
        };
    })

}))
