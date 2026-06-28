"use client";
import { useEffect, useState } from "react";
import { Button, Input } from "pixel-retroui";
import Quest from "@/classes/Quest";
import { Quest as QuestType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import localFont from "next/font/local";
import { Plus, Search } from "lucide-react";
import useSound from "use-sound";
const retroGaming = localFont({ src: "../../public/fonts/retro_gaming.ttf" });

export default function Toolbar({
  loadQuests,
}: {
  loadQuests: (
    page: number,
    statuses: "All" | "Active" | "Archived",
    filter: string[],
  ) => void;
}) {
  //store imports
  const character = useCharacterStore((state) => state.character);
  const allQuests = useJournalStore((state) => state.allQuests);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore(
    (state) => state.setDisplayedQuests,
  );
  const setAllQuests = useJournalStore((state) => state.setAllQuests);
  const journalError = useJournalStore((state) => state.journalError);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const [error] = useSound("/sounds/error.mp3");
  const setErrorAnim = useJournalStore((state) => state.setErrorAnim);
  const errorAnim = useJournalStore((state) => state.errorAnim);
  const setPage = useJournalStore((state) => state.setPage);

  const questsStatus = ["All", "Active", "Archived"];
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const status = useJournalStore((state) => state.status);
  const setStatus = useJournalStore((state) => state.setStatus);

  async function submitQuest() {
    const value = (document.getElementById("quest-input") as HTMLInputElement)
      .value;
    if (!value || value === "") return;
    const quest = new Quest();
    const feedback: { success?: boolean; err?: boolean; quest?: QuestType } =
      await quest.insert(value);

    if (feedback.success && feedback.quest) {
      setAreQuestsLoaded(false);
      setPage(1);
      setStatus("All");
      addNewQuestDynamically(feedback.quest);
      (document.getElementById("quest-input") as HTMLInputElement).value = "";
    } else {
      setJournalError("Server error. Please try again later.");
    }
  }

  function addNewQuestDynamically(newQuest: QuestType) {
    const q = allQuests ? [...allQuests] : [];
    q.unshift(newQuest);
    q.pop();
    setAllQuests(q)
    setDisplayedQuests(q);
  };

  function search(searchInput:string) {
    const q = allQuests ? [...allQuests] : [];
    const newList = q.filter((n) => n.body?.includes(searchInput));
    setDisplayedQuests([...newList]);
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
      setDisplayedQuests(allQuests ? [...allQuests] : []);
      return;
    };
    search(searchInput);
  }, [searchInput, searchOpen])

  return (
    <>
      <section className="flex flex-col gap-1  w-[95%] mx-auto">
        <div
          className={`flex items-center gap-2 pb-5 mb-2 border-b-2! border-neutral-900! ${retroGaming.className}`}
        >
          <input
            type="text"
            id="quest-input"
            placeholder="Your new quest..."
            maxLength={300}
            className="grow text-xs! border border-transparent! pl-3! outline-0! rounded bg-neutral-900 h-full! "
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
                  setStatus(s as "All" | "Active" | "Archived");
                }}
                className={`${status === s ? "border! border-amber-300! text-amber-300 cursor-pointer rounded p-1 mx-1 max-h-full" : "border! cursor-pointer rounded p-1 mx-1 max-h-full"}`}
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
                      setSearchInput(e.target.value)
                      search(searchInput);
                    }}
                  />
                </div>
              </div>
              <Search
                size={22}
                className="cursor-pointer"
                onPointerDown={() => {
                  searchOpen && setSearchInput("");
                  setSearchOpen((prev) => !prev)
                }}
              />
            </span>
          </div>

          <span
            className={`text-red-600 text-sm ${errorAnim ? "error-animate" : ""}`}
          >
            {journalError}
          </span>
        </div>
      </section>
    </>
  );
}
