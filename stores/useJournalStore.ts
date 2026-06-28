import { create } from 'zustand'
import { ListType } from "@/types/types";

interface UseJournalStore {
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
    areQuestsLoaded: boolean;
    setAreQuestsLoaded: (b: boolean) => void;
    errorAnim:boolean;
    setErrorAnim: (errorAnim:boolean) => void;
    resetQuests: () => void;

    page:number;
    setPage: (page:number) => void;

    lastQuestId:number;
    setLastQuestId: (questId:number) => void;

    numberOfPages:number;
    setNumberOfPages : (nb:number) => void;

    filter: string[];
    addFilter: (f:string) => void;
    removeFilter: (f:string) => void;
    resetFilter : () => void;

    status: "All" | "Active" | "Archived";
    setStatus: (st: "All" | "Active" | "Archived") => void
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
    }),
    resetQuests: () => set({allQuests:[]}),
    areQuestsLoaded: false,
    setAreQuestsLoaded: (b) => set({areQuestsLoaded: b}),
    errorAnim:false,
    setErrorAnim: (b) => set({errorAnim:b}),

    page:1,
    setPage : (n) => set({page:n <=0 ? 1 : n}),

    lastQuestId: 0,
    setLastQuestId: (n) => set({lastQuestId:n}),

    numberOfPages:1,
    setNumberOfPages: (n) => set({numberOfPages:n}),

    filter: [],
    addFilter : (f) => set((state) => ({filter: [...state.filter, f] })),
    removeFilter: (f) => set((state) => ({filter: state.filter.filter(n => n !== f) })),
    resetFilter: () => set({filter: []}),

    status: "All",
    setStatus: (st) => set({status: st})
}))
