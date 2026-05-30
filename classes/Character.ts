import { Draft, Class } from "@/types/types";
import { useCharacterStore } from "@/stores/useCharacterStore";
import logNewCharacter from "@/lib/auth/character/logNewCharacter";

export default class Character {
  private character_id: undefined | number;
  private username: string;
  private gender: string;
  private race: string;
  private user_class: string;
  private ac: number;
  private str: number;
  private dex: number;
  private con: number;
  private int: number;
  private wis: number;
  private cha: number;
  private xp: number;
  private hp: number;
  private dopamine: number;

  private updateDraft;

  constructor({ ...draft }) {
    // attributes based on draft
    this.character_id;
    this.username = draft.username;
    this.gender = draft.gender;
    this.race = draft.race;
    this.user_class = draft.user_class;
    this.str = draft.str;
    this.dex = draft.dex;
    this.con = draft.con;
    this.int = draft.int;
    this.wis = draft.wis;
    this.cha = draft.cha;
    this.updateDraft = useCharacterStore.getState().updateDraft;
    // attributes that'll be calculated later
    this.ac = 10;
    this.xp = 0;
    this.hp = 0;
    this.dopamine = 0;
  }

  calculateHitpoints() {
    const conModifier = Math.floor((this.con - 10) / 2);
    this.hp = Math.round(10 + conModifier);
    this.updateDraft({ hp: this.hp });
  }

  calculateDopamine(classes: Array<Class>, draft: Partial<Draft>) {
    // we fetch the presets stats of the chosen class
    const chosenClassStats = classes.find(
      (n: { class: string }) => n.class === this.user_class,
    );
    if (chosenClassStats) {
      // each class has a 'main' ability, we get it
      const mainAbility = chosenClassStats.mainAbility;

      // we fetch the value of the 'main ability' set by the user during character creation
      const mainAbilityValue = Object.entries(draft).find(([key, value]) => {
        if (key === mainAbility) return value;
      }) as [string, number] | undefined;

      // const diceRoll = Math.round(Math.random() * (10-1));
      const mainAbilityModifier =
        mainAbilityValue && mainAbilityValue[1]
          ? Math.floor((mainAbilityValue[1] - 10) / 2)
          : 0;
      this.dopamine = Math.round(20 + mainAbilityModifier);
      console.log(this.dopamine)
      this.updateDraft({ dopamine: this.dopamine });
    }
  }

  calculateAC(draft: Partial<Draft>) {
    const dex = draft.dex;
    const dexModifier = dex && Math.floor((dex - 10) / 2);
    this.ac = dexModifier ? 10 + dexModifier : 10;
    this.updateDraft({ ac: this.ac });
  }

  async completeProfile(draft: Partial<Draft>, classes: Array<Class>) {
    this.calculateHitpoints();
    this.calculateDopamine(classes, draft);
    this.calculateAC(draft);
    const newCharacter = {
          username: this.username,
          gender: this.gender,
          race: this.race,
          user_class: this.user_class,
          str: this.str,
          dex: this.dex,
          con: this.con,
          int: this.int,
          wis: this.wis,
          cha: this.cha,
          hp: this.hp,
          ac: this.ac,
          dopamine: this.dopamine,
          dopamine_consumed:0,
          coins:0,
          xp:0,
          lvl:1,
          damage_taken:0,

        }
      const feedback = await logNewCharacter(newCharacter);
      return feedback;
 
  }

  buildCharacterFromDraft(draft: Draft) {
    const newUser = {
      username: draft.username ?? null,
      xp: 0,
      hp: this.hp ?? null,
      dopamine: this.dopamine,
      dopamine_consumed: 0,
      gender: draft.gender ?? null,
      user_class: draft.user_class ?? null,
      race: draft.race ?? null,
      lvl: 1,
      str: draft.str ?? 10,
      dex: draft.dex ?? 10,
      con: draft.con ?? 10,
      int: draft.int ?? 10,
      wis: draft.wis ?? 10,
      cha: draft.cha ?? 10,
      ac: this.ac ?? null,
      profile_completed: true,
      damage_taken: 0,
      coins: 0,
      last_chapter_done: null
    };
    return newUser;
  }
}
