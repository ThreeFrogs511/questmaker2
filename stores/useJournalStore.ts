import { create } from 'zustand'
import { ListType } from "@/types/types";

interface UseJournalStore {
    questsCache: Array<ListType> | null;
    setQuestsCache: (q: Array<ListType>) => void;
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

    status: "" | "Active" | "Archived";
    setStatus: (st: "" | "Active" | "Archived") => void;

    nbOfQuestsTotal:number;
    setNbOfQuestsTotal: (nb:number) => void;

    setSearchInput : (str:string) => void;
    searchInput:string;
}


export const useJournalStore = create<UseJournalStore>((set) => ({
    questsCache: null,
    displayedQuests: null,

    whichPage:2,
    setQuestsCache : (q) => set({questsCache : q}),
    setDisplayedQuests : (dq) => set({displayedQuests: dq}),
    setWhichPage: (delta) => set((s) => ({whichPage: s.whichPage + delta})),
    resetPage : (n) => set({whichPage:n}),
    journalError:'',
    setJournalError : (err) => set({journalError:err}),
    addNewQuest: (nq) => set((s) => {
        if (!s.questsCache) return s;
        return {
            questsCache: s.questsCache
        };
    }),
    resetQuests: () => set({questsCache:[]}),
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

    status: "",
    setStatus: (st) => set({status: st}),

    nbOfQuestsTotal: 0,
    setNbOfQuestsTotal : (nb) => set({nbOfQuestsTotal:nb}),

    searchInput:"",
    setSearchInput: (str) => set({searchInput:str})

}))
