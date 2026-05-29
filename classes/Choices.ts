import type { Dispatch, SetStateAction } from "react";
import { Choice } from "@/types/types";
import { useUserStore } from "@/stores/useUserStore";
export default class ChoicesOptions {
  constructor() {}

  handler(
    setAllAvailableChoices: Dispatch<SetStateAction<Choice[] | undefined>>,
    choices: Choice[],
    pastUserChoices: Array<string | undefined>,
  ) {
    const filteredChoices = this.filterOutExpiredChoices(
      choices,
      pastUserChoices,
    );
    const dynamicChoices = this.insertDynamicInfo(filteredChoices);
    setAllAvailableChoices(dynamicChoices);
  }

  filterOutExpiredChoices(
    choices: Choice[],
    pastUserChoices: Array<string | undefined>,
  ) {
    // global choices like ['CONTINUE'], ['START COMBAT'] or user's movesets cannot be removed
    const lockedChoices = [
      "[CONTINUE]",
      "[START COMBAT]",
      "[Punch]",
      "[Fireball]",
      "[RESTART]",
    ];

    // we remove choices that were already made to avoid unwanted loops
    const filteredChoices = choices.filter((n: Choice) => {
      if (!pastUserChoices.includes(n.text)) {
        return n;
      } else if (
        pastUserChoices.includes(n.text) &&
        lockedChoices.includes(n.text)
      ) {
        return n;
      }
    });
    return [...filteredChoices];
  }

  insertDynamicInfo(filteredChoices: Choice[]) {
    const currentUser = useUserStore.getState().currentUser;
    if (filteredChoices) {
      const dynamicChoices = filteredChoices.map((n: Choice) => {
        if (n.text.includes("[USERNAME]")) {
          n.text = n.text.replace(
            "[USERNAME]",
            `${currentUser.username ?? ""}`,
          );
          return n;
        } else if (n.text.includes("[RACE]")) {
          n.text = n.text.replace("[RACE]", `${currentUser.race ?? ""}`);
          return n;
        } else {
          return n;
        }
      });
      return [...dynamicChoices];
    }
  }
}
