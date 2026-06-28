"use client";
import { useEffect, useTransition } from "react";
import Quest from "@/components/journal/Quest";
import Toolbar from "@/components/journal/Toolbar";
import { useJournalStore } from "@/stores/useJournalStore";
import localFont from "next/font/local";
import { fetchQuests } from "@/lib/quests/fetchQuests";
import Pages from "@/components/journal/Pages";
import SkeletonQuest from "@/components/journal/SkeletonQuest";

const retroGaming = localFont({ src: "../../public/fonts/retro_gaming.ttf" });

export default function Journal() {
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const areQuestsLoaded = useJournalStore((state) => state.areQuestsLoaded);
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );
  const page = useJournalStore((state) => state.page);
  const setNumberOfPages = useJournalStore((state) => state.setNumberOfPages);
  const status = useJournalStore((state) => state.status);
  const filter = useJournalStore((state) => state.filter);

  const [isPending, startTransition] = useTransition();

  const skeletonUINbOfQuest = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ];

  const listContainer = document.getElementById("quests-list");

  function loadQuests(
    page: number,
    statuses: "All" | "Active" | "Archived",
    filter: string[],
  ) {
    startTransition(async () => {
      if (page <= 1) {
        const data = await fetchQuests(1, statuses, filter);
        if (data.err || !data.quests) {
          setJournalError(data.err);
          return;
        }

        const rawQuests = data.quests ?? [];

        const setAllQuests = useJournalStore.getState().setAllQuests;
        const setDisplayedQuests =
          useJournalStore.getState().setDisplayedQuests;
        setAllQuests(rawQuests);

        setDisplayedQuests(rawQuests);
        setNumberOfPages(data.pages ?? 0);
        setAreQuestsLoaded(true);
        return;
      } else if (page > 1) {
        const data = await fetchQuests(page, statuses, filter);
        if (data.err || !data.quests) {
          setJournalError(data.err);
          return;
        }

        const rawQuests = data.quests ?? [];

        const setAllQuests = useJournalStore.getState().setAllQuests;
        const setDisplayedQuests =
          useJournalStore.getState().setDisplayedQuests;
        setAllQuests(rawQuests);

        setDisplayedQuests(rawQuests);
        setNumberOfPages(data.pages ?? 1);
        setAreQuestsLoaded(true);
        return;
      }
    });
  }

  useEffect(() => {
    if (areQuestsLoaded) return;
    loadQuests(page, status, filter);
    listContainer?.scrollTo(0, 0);
  }, [page, filter, status]);

  return (
    <>
      <Toolbar loadQuests={loadQuests} />

      {/* the list */}
      {displayedQuests && !isPending ? (
        <div
          id="quests-list"
          className={`scrollingContainer h-full!  flex flex-col gap-2 ${retroGaming.className}`}
        >
          {displayedQuests.length > 0 ? (
            displayedQuests?.map((item, index) => (
              <Quest item={item} key={index} />
            ))
          ) : (
            <p className="text-center h-full flex items-center justify-center">
              No quests found in your journal.
            </p>
          )}
          <Pages />
        </div>
      ) : (
        <div
          className={`scrollingContainer h-full! flex flex-col gap-2 ${retroGaming.className}`}
        >
          {skeletonUINbOfQuest.map((item, index) => (
            <SkeletonQuest key={index} />
          ))}
        </div>
      )}
    </>
  );
}
