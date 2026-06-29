"use client";
import { useEffect, useState } from "react";
import { Button } from "pixel-retroui";
import { insertQuest } from "@/lib/quests/questActions";
import { Quest as QuestType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import localFont from "next/font/local";
import { Plus, Search, Info } from "lucide-react";
import useSound from "use-sound";
const retroGaming = localFont({ src: "../../public/fonts/retro_gaming.ttf" });

export default function Toolbar({
  loadQuests,
}: {
  loadQuests: (
    page: number,
    statuses: "" | "Active" | "Archived",
    filter: string[],
    cursor: number,
  ) => void;
}) {
  //store imports
  const character = useCharacterStore((state) => state.character);
  const questsCache = useJournalStore((state) => state.questsCache);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore(
    (state) => state.setDisplayedQuests,
  );
  const setQuestsCache = useJournalStore((state) => state.setQuestsCache);
  const journalError = useJournalStore((state) => state.journalError);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const [error] = useSound("/sounds/error.mp3");
  const setErrorAnim = useJournalStore((state) => state.setErrorAnim);
  const errorAnim = useJournalStore((state) => state.errorAnim);
  const setPage = useJournalStore((state) => state.setPage);
  const nbOfPages = useJournalStore((state) => state.numberOfPages);
  const lastQuestId = useJournalStore((state) => state.lastQuestId);
  const setLastQuestId = useJournalStore((state) => state.setLastQuestId);

  const questsStatus = ["Active", "Archived"];
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );

  const nbOfQuestsTotal = useJournalStore((state) => state.nbOfQuestsTotal);
  const setNbOfQuestsTotal = useJournalStore(
    (state) => state.setNbOfQuestsTotal,
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const status = useJournalStore((state) => state.status);
  const setStatus = useJournalStore((state) => state.setStatus);

  async function submitQuest() {
    setJournalError("");
    setSearchOpen(false);

    const value = (document.getElementById("quest-input") as HTMLInputElement)
      .value;
    if (!value || value === "") {
      setJournalError("You can't submit an empty quest.");
      return;
    }

    //If "Archived" status filter is on, the user can add
    //a completed quest directly, else it's false by default;

    const feedback = await insertQuest(
      value,
      status === "Archived" ? true : false,
    );

    if (feedback.success && feedback.quest) {
      setPage(1);
      updateListDynamicallyAfterNewQuest(feedback.quest);
      setNbOfQuestsTotal(Number(nbOfQuestsTotal) + 1);

      if (nbOfPages > 1) {
        const newLastQuestId = lastQuestId + 1;
        setLastQuestId(newLastQuestId);
      }

      (document.getElementById("quest-input") as HTMLInputElement).value = "";
    } else {
      setJournalError("Server error. Please try again later.");
    }
  }

  function updateListDynamicallyAfterNewQuest(newQuest: QuestType) {
    const q = questsCache ? [...questsCache] : [];

    if (nbOfPages > 1 || nbOfQuestsTotal === 15) {
      q.unshift(newQuest);
      q.pop();
      setQuestsCache(q);
    } else {
      q.unshift(newQuest);
      setQuestsCache(q);
    }
    setDisplayedQuests(q);
  }

  useEffect(() => {
    if (journalError !== "") {
      setErrorAnim(false);
      error();
      requestAnimationFrame(() => setErrorAnim(true));
    }
    const t = setTimeout(() => {
      setErrorAnim(false);
    }, 1000);
    clearTimeout(t);
  }, [journalError]);

  useEffect(() => {
    if (searchInput === "") {
      setDisplayedQuests(questsCache ? [...questsCache] : []);
      return;
    }
    const q = questsCache ? [...questsCache] : [];
    const newList = q.filter((n) => n.body?.startsWith(searchInput));
    setDisplayedQuests([...newList]);
  }, [searchInput, searchOpen]);

  return (
    <>
      <section className="flex flex-col gap-1  w-[95%] mx-auto">
        <div
          className={`flex flex-col gap-2 pb-2 mb-2 border-b-2! border-neutral-900! ${retroGaming.className}`}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="quest-input"
              placeholder="Your new quest..."
              maxLength={300}
              className={`${journalError === "You can't submit an empty quest." ? "grow text-xs! border pl-3! outline-0! rounded border-red-700! bg-neutral-900 h-full! " : "grow text-xs! border border-transparent! pl-3! outline-0! rounded bg-neutral-900 h-full! "}`}
            />

            {/* submit button */}
            <Button
              bg="black"
              textColor="white"
              borderColor="white"
              className="w-1/10 md:w-1/15 h-[70%]! text-xs! flex justify-center "
              onClick={() => submitQuest()}
            >
              <Plus />
            </Button>
          </div>
          <span
          id="error-message"
            className={`text-red-600 min-h-5 text-sm ${errorAnim ? "error-animate" : ""}`}
          >
            {journalError ==="" ? "" : <p className="flex! items-center gap-3 "> <Info size={18} /> {journalError}</p>}
          </span>
        </div>

        <div
          id="tools"
          className="grid grid-cols-7 items-center gap-1 border-b-2! border-neutral-900! pb-2 mb-5 "
        >
          <span id="coins">
            coins : <span className="text-amber-300">{character?.coins}</span>
          </span>
          <div id="statuses" className="flex col-span-3">
            {questsStatus.map((s, index) => (
              <span
                onPointerDown={() => {
                  setAreQuestsLoaded(false);
                  setPage(1);
                  setStatus(
                    status === s ? "" : (s as "" | "Active" | "Archived"),
                  );
                }}
                className={`${status === s ? "border! border-amber-300! text-amber-300 cursor-pointer rounded p-1 mx-1 max-h-full" : "border! cursor-pointer rounded border-neutral-900! text-neutral-900! p-1 mx-1 max-h-full"}`}
                key={index}
              >
                {s}
              </span>
            ))}
          </div>

          <div id="sb-container" className="justify-end col-span-3 flex">
            <span
              id="search-bar"
              className="flex justify-end items-center bg-neutral-900 p-2 rounded-full"
            >
              <div
                className="grid overflow-hidden"
                style={{
                  gridTemplateColumns: searchOpen ? "1fr" : "0fr",
                  transition: "grid-template-columns 300ms ease",
                }}
              >
                <div className="overflow-hidden min-w-0">
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full px-2"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Search
                size={22}
                className="cursor-pointer"
                onPointerDown={() => {
                  searchOpen && setSearchInput("");
                  setSearchOpen((prev) => !prev);
                }}
              />
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
