"use client";
import useSound from "use-sound";
import { useRef, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import Quest from "@/classes/Quest";
import { ListType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";

export default function List({
  displayedQuests,
  setDisplayedQuestsAction,
  setAllQuestsAction,
  allQuests,
  whichPage,
}: {
  displayedQuests: Array<ListType> | null;
  setDisplayedQuestsAction: React.Dispatch<
    React.SetStateAction<Array<ListType> | null>
  >;
  allQuests: Array<ListType> | null;
  setAllQuestsAction: React.Dispatch<
    React.SetStateAction<Array<ListType> | null>
  >;
  whichPage: number;
}) {
  // current user data
  const currentUser = useUserStore((state) => state.currentUser);
  const updateStats = useUserStore((state) => state.updateStats);
  const setJournalError = useJournalStore((state) => state.setJournalError);

  // sounds
  const [ticking] = useSound("/sounds/pickupCoin.wav");
  const [unticking] = useSound("/sounds/click.wav");
  const [deleting] = useSound("/sounds/explosion.wav");

  const [error, setError] = useState("");

  // prevents double clicking on completion boxes
  const isLocked = useRef(false);

  async function completion(
    currentCompleted: boolean | null,
    id: number | null,
    user_id: number | null,
  ) {
    if (isLocked.current) return;

    // locking the function to avoid duplicates
    isLocked.current = true;

    if (id && currentCompleted !== null) {
      const completionState = !currentCompleted;
      //new quest class to reach the complete() method
      const quest = new Quest();
      const feedback = await quest.complete(id, completionState, user_id);

      if (feedback.error) {
        console.log(feedback.error);
        if ((feedback.error = "limit")) {
          setJournalError(
            "Hourly limit exceeded! Try again in an hour!",
          );
        } else {
          setJournalError("Server error. Please try again.");
        }
        isLocked.current = false;
        return;
      }

      if (feedback.success && displayedQuests && allQuests) {
        setError("");
        // updating coins value
        updateStats({ coins: feedback.coins[0].coins });

        // playing the sound effect
        completionState ? ticking() : unticking();

        // updating the allToDos list
        const updatedList = allQuests.map((n) => {
          if (n.id === id) {
            const object = {
              ...n,
              completed: currentCompleted === true ? false : true,
            };
            return object;
          } else {
            return n;
          }
        });

        // storing the allQuests list
        setAllQuestsAction(updatedList);

        // updating the displayedQuests list
        // to show the update on-screen
        const tempList = displayedQuests.map((n) => {
          if (n.id === id) {
            const object = {
              ...n,
              completed: currentCompleted === true ? false : true,
            };
            return object;
          } else {
            return n;
          }
        });
        setDisplayedQuestsAction(tempList);

        // filtering out the targeted to-do if necessary
        if (whichPage !== 2) {
          setTimeout(() => {
            const filteredList = displayedQuests.filter((n) => n.id !== id);
            setDisplayedQuestsAction(filteredList);
            // unlocking the function
            feedback.success && (isLocked.current = false);
          }, 500);
        } else {
          setDisplayedQuestsAction(updatedList);
          // unlocking the function
          feedback.success && (isLocked.current = false);
        }
      }
    }
  }

  async function deletion(id: number | null) {
    const quest = new Quest();
    const feedback = id && (await quest.delete(id));
    if (feedback.success) {
      // deletion sound effect
      deleting();
      // updating the allQuests and displayedQuests lists
      if (allQuests) {
        const updatedList: Array<ListType> | null = allQuests.filter(
          (n) => n.id !== id,
        );
        setAllQuestsAction(updatedList);
        setDisplayedQuestsAction((prev) =>
          prev ? prev.filter((n) => n.id !== id) : [],
        );
      }
    }
  }

  return (
    <>
      <ul className="h-full!">
          { displayedQuests?.map((item, index) => (
            <li
              data-id={item.id}
              data-completion={item.completed}
              data-user-id={item?.user_id}
              className="flex justify-between items-center text-2xl py-4 px-2 hover:underline"
              key={index}
            >
              <div className="flex items-center gap-3">
                {/* box */}
                <span
                  className={
                    item.completed
                      ? ` p-3 cursor-pointer bg-green-500 inline-block min-w-5 h-5 border border-white mr-5 `
                      : ` p-3 cursor-pointer inline-block min-w-5 h-5 border border-white mr-5 `
                  }
                  onClick={() =>
                    completion(item.completed, item.id, item?.user_id)
                  }
                ></span>

                {/* quest body */}
                <p
                  className={`text-sm! md:text-sm! tracking-widest  wrap-anywhere`}
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
            </li>
          ))}
        
      </ul>
    </>
  );
}
