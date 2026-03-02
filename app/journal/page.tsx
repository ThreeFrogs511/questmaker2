"use client";
import { useEffect} from "react";
import List from "@/components/journal/List";
import Toolbar from "@/components/journal/Toolbar";
import { Press_Start_2P } from "next/font/google";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";
import { useJournalStore } from "@/stores/useJournalStore";
import useSound from "use-sound";

const PressStartFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function Journal() {
  //store imports
  const currentUser = useUserStore((state) => state.currentUser);
  const resetDraft = useCharacterCreationStore((state) => state.resetDraft);
  const journalError = useJournalStore((state) => state.journalError);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const whichPage = useJournalStore((state) => state.whichPage);
  const setWhichPage = useJournalStore((state) => state.setWhichPage);
  const resetPage = useJournalStore((state) => state.resetPage);
  const allQuests = useJournalStore((state) => state.allQuests);
  const setAllQuests = useJournalStore((state) => state.setAllQuests);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore((state) => state.setDisplayedQuests);
  const areQuestsLoaded = useJournalStore((state) => state.areQuestsLoaded);
  // warns us when the quests are all fetched


  const [turnPage] = useSound("/sounds/page.mp3");
  const journal = ["Current quests", "Archived quests", "All quests"];
 

  useEffect(() => {
    resetDraft({});
    
  });

  useEffect(() => {
    setJournalError("");
  }, [])

  // sorting list based on the page number
  useEffect(() => {
    if (allQuests) {
      switch (whichPage) {
        case 0:
          const currentQuests = allQuests.filter((n) => n.completed === false);
          setDisplayedQuests(currentQuests);
          break;

        case 1:
          const archivedQuests = allQuests.filter((n) => n.completed === true);
          setDisplayedQuests(archivedQuests);
          break;

        case 2:
          setDisplayedQuests(allQuests);
          break;
      }
   
    }
  }, [whichPage, allQuests]);

  useEffect(() => {
       turnPage();
  }, [whichPage])

  return (
    <>
      <div className="wrapper">
        <Header />
        <section
          id="todo-list"
          className="h-full overflow-hidden flex flex-col"
        >
          <div
            id="journal-navigation"
            className="flex justify-between items-center mb-0"
          >
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-8 cursor-pointer"
              onClick={() => whichPage === 0 ? resetPage(2) : setWhichPage(-1)}
            >
              <path
                d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12zM10 7H8v2h2V7zm0 0h2V5h-2v2zm0 10H8v-2h2v2zm0 0h2v2h-2v-2z"
                fill="currentColor"
              />
            </svg>
            <h2
              className={`col-span-1 text-center text-xs! lg:text-base! text-stone-300 ${PressStartFont.className}`}
            >
              {journal[whichPage]}
            </h2>
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-8 cursor-pointer"
              onClick={() =>whichPage === 2 ? resetPage(0) : setWhichPage(1)}
            >
              <path
                d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* toolbar */}
          <Toolbar/>
          <div className="flex items-center gap-5 mb-2">
            <span className="font-minecraft">
              coins :{" "}
              <span className="text-amber-300 font-minecraft">
                {currentUser?.coins}
              </span>
            </span>
            <span className="text-red-600 text-sm">{journalError}</span>
          </div>

          {/* list of quests */}
          {displayedQuests && displayedQuests.length > 0 ? (
            <List/>
          ) : (
            <div className="w-full h-full flex flex-col justify-center font-minecraft text-base lg:text-xl! ">
              {areQuestsLoaded ? (
                <div className="flex flex-col items-center">
                  <p>No quests to display.</p>
                </div>
              ) : (
                <p className="text-center w-full">Loading quests...</p>
              )}
            </div>
          )}
        </section>
        <Footer />
      </div>
    </>
  );
}
