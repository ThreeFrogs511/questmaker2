"use client";
import { ListType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";

export default async function prepareQuests(list: Array<ListType>) {
  const setAllQuests = useJournalStore.getState().setAllQuests;
  const setDisplayedQuests = useJournalStore.getState().setDisplayedQuests;
  setAllQuests(list);
  
  const currentQuests = list.filter((n) => n.completed === false);
  setDisplayedQuests(currentQuests);
  
}
