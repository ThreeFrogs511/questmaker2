"use client";
import { Button, Input } from "pixel-retroui";
import useSound from "use-sound";
import Quest from "@/classes/Quest";
import { useUserStore } from "@/stores/useUserStore";
import { useJournalStore } from "@/stores/useJournalStore";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function Toolbar() {

  //store imports
  const currentUser = useUserStore((state) => state.currentUser);
  const whichPage = useJournalStore((state) => state.whichPage);
  const resetPage = useJournalStore((state) => state.resetPage);
  const allQuests = useJournalStore((state) => state.allQuests);
  const setAllQuests = useJournalStore((state) => state.setAllQuests);
  const setDisplayedQuests = useJournalStore((state) => state.setDisplayedQuests);


  async function submitToDoClick() {

    const value = (document.getElementById("todo") as HTMLInputElement).value;
    if (value && currentUser.id) {
      const quest = new Quest();
      const feedback = await quest.insert(value, currentUser.id);

      if (feedback.success) {
        const updatedList = [...allQuests ?? []];
        updatedList.unshift(feedback.quest);
        setAllQuests(updatedList);
        (document.getElementById("todo") as HTMLInputElement).value = "";

        if (whichPage === 0 || whichPage === 2)  {
          const updatedCurrentList = updatedList.filter(n => n.completed === false);
          setDisplayedQuests(updatedCurrentList);
        } else {
          resetPage(2);
        }
      } else {
        console.log(feedback.error);
      }
    }
  }

  return (
    <>
      <div className={`flex mb-1 ${retroGaming.className}`}>
        <Input
          bg="black"
          textColor="white"
          borderColor="white"
          type="text"
          id="todo"
          placeholder="Your new quest..."
          maxLength={300}
          className="grow h-[70%]! text-xs!"
        />

        {/* submit button */}
        <Button
          bg="black"
          textColor="white"
          borderColor="white"
          className="w-1/10 md:w-1/15 h-[70%]! text-xs! "
          onClick={() => submitToDoClick()}
        >
          +
        </Button>
      </div>
    </>
  );
}
