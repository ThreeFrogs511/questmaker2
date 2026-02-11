"use client";
import { Press_Start_2P } from "next/font/google";
import { Button, Input } from "pixel-retroui";
import { ListType } from "@/types/types";
import Quest from "@/classes/Quest";
import { useUserStore } from "@/stores/useUserStore";

const PressStartFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function Toolbar({
  setDisplayedQuestsAction,
  setAllQuestsAction,
  setWhichPageAction,
  whichPage,
}: {
  setDisplayedQuestsAction: React.Dispatch<
    React.SetStateAction<Array<ListType> | null>
  >;
  setAllQuestsAction: React.Dispatch<
    React.SetStateAction<Array<ListType> | null>
  >;
  setWhichPageAction: React.Dispatch<React.SetStateAction<number>>;
  whichPage: number;
}) {
  const currentUser = useUserStore((state) => state.currentUser);

  async function submitToDoClick() {
    const value = (document.getElementById("todo") as HTMLInputElement).value;

    if (value && currentUser.id) {
      const quest = new Quest();
      const feedback = await quest.insert(value, currentUser.id);

      if (feedback.success) {
        setAllQuestsAction((prev) => [feedback.quest, ...(prev ?? [])]);
        (document.getElementById("todo") as HTMLInputElement).value = "";

        if (whichPage === 0) {
          setDisplayedQuestsAction((prev) => [feedback.quest, ...(prev ?? [])]);
        } else {
          setWhichPageAction(0);
        }
      } else {
        console.log(feedback.error);
      }
    }
  }

  return (
    <>
      <div className="flex h-10 mb-5 pl-1">
        <Input
          bg="black"
          textColor="white"
          borderColor="white"
          type="text"
          id="todo"
          placeholder="Your quest..."
          maxLength={300}
          className={` grow h-full ${PressStartFont.className} placeholder:${PressStartFont.className}`}
        />

        {/* submit button */}
        <Button
          bg="black"
          textColor="white"
          borderColor="white"
          className="w-1/10 h-full text-lg "
          onClick={() => submitToDoClick()}
        >
          +
        </Button>
      </div>
    </>
  );
}
