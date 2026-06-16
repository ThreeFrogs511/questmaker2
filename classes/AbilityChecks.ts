import { useCharacterStore } from "@/stores/useCharacterStore";
import { Choice, Nodes } from "@/types/types";
export default class AbilityChecks {

  handler(currentChoice: Choice, node: keyof Nodes | string | undefined) {
    if (currentChoice && node) {

      const dc = currentChoice.dc;
      if (dc) {
        const character = useCharacterStore.getState().character;
        const statKey = currentChoice.check;
        const userStat = statKey
          ? Object.entries(character).find(([key]) => key === statKey)
          : undefined;
        const modifier = Math.floor(((userStat?.[1] as number ?? 10) - 10) / 2);
        let abilityScore = Math.floor(Math.random() * 20) + 1 + modifier;
        abilityScore <= 0 && (abilityScore = 1);

        if (abilityScore < dc) {
          return { result: false, value: abilityScore };
        } else {
          return { result: true, value: abilityScore };
        }

      }
    }
  }
}


