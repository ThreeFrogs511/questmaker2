"use client";
import useSound from "use-sound";
import { useRef, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import Quest from "@/classes/Quest";
import { ListType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { Card } from "pixel-retroui";
export default function List() {
  // current user data
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const allQuests = useJournalStore((state) => state.allQuests);
  const setAllQuests = useJournalStore((state) => state.setAllQuests);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore((state) => state.setDisplayedQuests);

  // sounds
  const [ticking] = useSound("/sounds/pickupCoin.wav");
  const [unticking] = useSound("/sounds/click.wav");
  const [deleting] = useSound("/sounds/explosion.wav");

  // prevents double clicking on completion boxes
  const isLocked = useRef(false);

  async function completion(
    currentCompleted: boolean | null,
    id: number | null,
    user_id: number | null,
  ) {
    if (isLocked.current) return;
    if (!id || currentCompleted === null || !allQuests || !displayedQuests) return;

    isLocked.current = true;
    const completionState = !currentCompleted;

    // optimistic update: update UI and play sound immediately
    if (completionState) {
      ticking();
    } else {
      unticking();
    }
    const optimisticList = allQuests.map((n) =>
      n.id === id ? { ...n, completed: completionState } : n
    );
    setAllQuests(optimisticList);

    const quest = new Quest();
    const feedback = await quest.complete(id, completionState, user_id);

    if (feedback.error) {
      // revert optimistic update on error
      setAllQuests(allQuests);
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
      updateStats({ coins: feedback.coins[0].coins });
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

      const updatedList: Array<ListType> = allQuests.filter((n) => n.id !== id);
      setAllQuests(updatedList);
      const updatedCurrentList: Array<ListType> = updatedList.filter((n) => n.completed === false);
      setDisplayedQuests(updatedCurrentList);
    }
  };

  return (
    <>
      <div className="scrollingContainer h-full! flex flex-col gap-2">
          { displayedQuests?.map((item, index) => (
            <Card
              bg="black"
              borderColor="transparent"
              shadowColor="transparent"
              textColor="white"
              data-id={item.id}
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
                    completion(item.completed, item.id, item?.user_id)
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
                onClick={() => deletion(item.id)}
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
