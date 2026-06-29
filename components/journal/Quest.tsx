"use client";
import { useRef } from "react";
import { completeQuest, deleteQuest } from "@/lib/quests/questActions";
import { Quest as QuestType, ListType } from "@/types/types";
import { useJournalStore } from "@/stores/useJournalStore";
import { Card } from "pixel-retroui";
import { useCharacterStore } from "@/stores/useCharacterStore";
import JournalAudioManager from "@/classes/JournalAudioManager";

export default function Quest({ item }: { item: ListType }) {
  const character = useCharacterStore((state) => state.character);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const setJournalError = useJournalStore((state) => state.setJournalError);
  const questsCache = useJournalStore((state) => state.questsCache);
  const setQuestsCache = useJournalStore((state) => state.setQuestsCache);
  const displayedQuests = useJournalStore((state) => state.displayedQuests);
  const setDisplayedQuests = useJournalStore(
    (state) => state.setDisplayedQuests,
  );
  const page = useJournalStore((state) => state.page);
  const setPage = useJournalStore((state) => state.setPage);
  const status = useJournalStore((state) => state.status);
  const numberOfPages = useJournalStore((state) => state.numberOfPages);
  const setNumberOfPages = useJournalStore((state) => state.setNumberOfPages);
  const nbOfQuestsTotal = useJournalStore((state) => state.nbOfQuestsTotal);
  const setNbOfQuestsTotal = useJournalStore((state) => state.setNbOfQuestsTotal);
  const lastQuestId = useJournalStore((state) => state.lastQuestId);
  const setLastQuestId = useJournalStore((state) => state.setLastQuestId);
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );


  const isLocked = useRef(false);

  async function completion(
    currentCompleted: boolean | null,
    quest_id: number | null,
  ) {
    if (isLocked.current) return;
    if (
      !quest_id ||
      currentCompleted === null ||
      !questsCache ||
      !displayedQuests
    )
      return;

    isLocked.current = true;
    const completionState = !currentCompleted;

    if (completionState) {
      new JournalAudioManager().playSfx("tickingSound");
    } else {
      new JournalAudioManager().playSfx("untickingSound");
    }

    //snapshot
    const previousList = [...displayedQuests];
    const previousCoins = character?.coins ?? 0;

    //optimistic logic
    let optimisticList: ListType[];
    optimisticList = displayedQuests.map((n) =>
      n.quest_id === quest_id ? { ...n, completed: completionState } : n,
    );

    //removing completed/uncompleted quest based on the status filter
    if (completionState === true) {
      updateCharacter({ coins: (Number(character?.coins) ?? 0) + 1 });
      if (status === "Active") {
        setDisplayedQuests(optimisticList); // we show the tick one second before removal

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }).then(() => {
          optimisticList = optimisticList.filter(
            (n: ListType) => n.quest_id !== quest_id,
          );
          return;
        });
      }
    } else {
      updateCharacter({
        coins: Number(character?.coins) <= 0 ? 0 : Number(character?.coins) - 1,
      });
      if (status === "Archived") {
        setDisplayedQuests(optimisticList); // we show the tick one second before removal

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }).then(() => {
          optimisticList = optimisticList.filter(
            (n: ListType) => n.quest_id !== quest_id,
          );
          return;
        });
      }
    }

    setDisplayedQuests(optimisticList);
    setJournalError("");

    const feedback = await completeQuest(quest_id, completionState);

    if (feedback.error) {
      setDisplayedQuests(previousList);
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
    }

    isLocked.current = false;
  }

  async function deletion(questId: number | null) {
    if (!questId || !questsCache) return;
    const feedback = await deleteQuest(questId, lastQuestId);

    if (feedback.success) {
      new JournalAudioManager().playSfx("deletingQuestSound");

      if (!displayedQuests) return;
      
      //we first remove the deleted quest from the client-side list
      const updatedList: Array<ListType> = displayedQuests.filter(
        (n) => n.quest_id !== questId,
      );

      //decrement the nb of quests
      setNbOfQuestsTotal(nbOfQuestsTotal - 1);

      //handle the case where there is only one quest in the page
      //in that case, we need to delete the quest AND the page
      //we simply force a database query to synch client/server data
      if (displayedQuests.length<=1) {
        setPage(page - 1)
        setAreQuestsLoaded(false);
      };

      //we add the quest from the next page to fill the now empty slot
      //only relevant if there are more than 1 page
      if (feedback.lastQuest && feedback.lastQuest.quest_id && numberOfPages > 1) {
        updatedList.push(feedback.lastQuest);
        setLastQuestId(feedback.lastQuest.quest_id);
      }

      //we update the lists
      setQuestsCache(updatedList);
      setDisplayedQuests(updatedList);

    } else if (feedback.err) {
      console.log("error: ", feedback.err);
    }
  }

  return (
    <Card
      bg="black"
      borderColor="gray"
      shadowColor="transparent"
      textColor="white"
      data-id={item.quest_id}
      data-completion={item.completed}
      data-user-id={item?.user_id}
      className="flex justify-between items-center border-neutral-900!  md:py-5! px-2! mb-3! md:mx-5!"
    >
      <div className="flex items-center gap-3">
        <span
          className={
            item.completed
              ? ` p-1 cursor-pointer bg-green-500 inline-block min-w-5 h-5 border border-white mr-5 `
              : ` p-1 cursor-pointer inline-block min-w-5 h-5 border border-white mr-5 `
          }
          onClick={() => completion(item.completed, item.quest_id)}
        ></span>

        <p className={`text-xs! lg:text-sm! tracking-widest wrap-anywhere`}>
          {item.body}
        </p>
      </div>

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
  );
}
