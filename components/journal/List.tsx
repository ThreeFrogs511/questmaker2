"use client";
import useSound from "use-sound";
import { useRef, useState } from "react";
import Quest from "@/classes/Quest";
import { ListType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { Card } from "pixel-retroui";
import localFont from "next/font/local";
import { useCharacterStore } from "@/stores/useCharacterStore";
const retroGaming = localFont({ src: "../../public/fonts/retro_gaming.ttf" });

export default function List() {
  // current user data
  const character = useCharacterStore((state) => state.character);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const journalError = useJournalStore((state) => state.journalError);
  const allQuests = useJournalStore((state) => state.allQuests);
  const setAllQuests = useJournalStore((state) => state.setAllQuests);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore(
    (state) => state.setDisplayedQuests,
  );
  const setErrorAnim = useJournalStore((state) => state.setErrorAnim);

  // sounds
  const [ticking, { stop }] = useSound("/sounds/pickupCoin.wav");
  const [unticking] = useSound("/sounds/click.wav");
  const [deleting] = useSound("/sounds/explosion.wav");
  const [error] = useSound("/sounds/error.mp3", { preload: true });
  // prevents double clicking on completion boxes
  const isLocked = useRef(false);

  async function completion(
    currentCompleted: boolean | null,
    quest_id: number | null,
    user_id: number | null,
  ) {

    if (isLocked.current) return;
    if (
      !quest_id ||
      currentCompleted === null ||
      !allQuests ||
      !displayedQuests
    )
      return;

    isLocked.current = true;
    const completionState = !currentCompleted;

    // optimistic update: update UI and play sound immediately
    if (completionState) {
      ticking();
    } else {
      unticking();
    }

    const previousList = [...allQuests];
    const previousCoins = character?.coins ?? 0;
    const optimisticList = allQuests.map((n) =>
      n.quest_id === quest_id ? { ...n, completed: completionState } : n,
    );
    setAllQuests(optimisticList);

    if (!currentCompleted) {
      updateCharacter({ coins: (Number(character?.coins) ?? 0) + 1 });
    } else {
      updateCharacter({
        coins: (Number(character?.coins) <= 0 ? 0 : Number(character?.coins) - 1),
      });
    }
    setJournalError("");

    const quest = new Quest();
    const feedback = await quest.complete(quest_id, completionState, user_id);

    if (feedback.error) {
      // revert optimistic update on error
      console.log(feedback)
      setAllQuests(previousList);
      updateCharacter({ coins: previousCoins });

      if (feedback.error === "limit") {
        setJournalError("Hourly limit exceeded! Try again in an hour!");
      } else {
        setJournalError("Server error. Please try again.");
      }

      isLocked.current = false;
      return;
    }

    if (feedback.success) {
      setJournalError("");
      !currentCompleted;
    }

    isLocked.current = false;
  }

  async function deletion(id: number | null) {
    if (!id || !allQuests) return;

    const quest = new Quest();
    const feedback = await quest.delete(id);

    if (feedback.success) {
      // deletion sound effect
      deleting();

      const updatedList: Array<ListType> = allQuests.filter(
        (n) => n.quest_id !== id,
      );
      setAllQuests(updatedList);
      const updatedCurrentList: Array<ListType> = updatedList.filter(
        (n) => n.completed === false,
      );
      setDisplayedQuests(updatedCurrentList);
    }
  }

  return (
    <>
      <div
        className={`scrollingContainer h-full! flex flex-col gap-2 ${retroGaming.className}`}
      >
        {displayedQuests?.map((item, index) => (
          <Card
            bg="black"
            borderColor="transparent"
            shadowColor="transparent"
            textColor="white"
            data-id={item.quest_id}
            data-completion={item.completed}
            data-user-id={item?.user_id}
            className="flex justify-between  items-center hover:border-white text-xl  py-1"
            key={index}
          >
            <div className="flex items-center gap-3">
              {/* box */}
              <span
                className={
                  item.completed
                    ? ` p-1 cursor-pointer bg-green-500 inline-block min-w-5 h-5 border border-white mr-5 `
                    : ` p-1 cursor-pointer inline-block min-w-5 h-5 border border-white mr-5 `
                }
                onClick={() =>
                  completion(item.completed, item.quest_id, item?.user_id)
                }
              ></span>

              {/* quest body */}
              <p
                className={`text-sm! md:text-xs! tracking-widest  wrap-anywhere`}
              >
                {item.body}
              </p>
            </div>

            {/* quest garbage can */}
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="cursor-pointer max-w-5 h-auto ml-5 hover:text-red-500"
              onClick={() => deletion(item.quest_id)}
            >
              <path
                d="M16 2v4h6v2h-2v14H4V8H2V6h6V2h8zm-2 2h-4v2h4V4zm0 4H6v12h12V8h-4z"
                fill="currentColor"
              />
            </svg>
          </Card>
        ))}
      </div>
    </>
  );
}
