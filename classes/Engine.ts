"use client";
import type { Dispatch, SetStateAction } from "react";
import { Nodes, User, Choice, ChoiceResult, CombatItem } from "@/types/types";
import AbilityChecks from "./AbilityChecks";
import Penalties from "./Penalties";
import ExclusivePaths from "./ExclusivePaths";
import Combat from "./CombatSystem/Combat";
import ChoicesOptions from "./Choices";

import { useNarrationStore } from "@/stores/useNarrationStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import AudioManager from "./AudioManager";

export default class Engine {
  // main attributes
  private node;
  private updateNode;

  // campaign attribute
  private relevantChoices: Array<{ node: string; text: string }>;
  private accumulatedXp: number;

  //audio
  private audioManager: AudioManager = new AudioManager();
  private currentMusic: string = "";
  private currentSfx: string = "";

  // class workers
  private abilityChecks;
  private penalties;
  private exclusivePaths;
  private combat: Combat | undefined;
  private choicesOptions;

  //story attributes
  private pastNodes: Array<string | undefined> = [];
  private pastUserChoices: Array<string | undefined> = [];

  // combat
  combatLockOn: boolean;

  constructor(node: keyof Nodes | undefined) {
    // campaign
    this.node = node;
    this.updateNode = useNarrationStore.getState().updateNode;
    this.accumulatedXp = 0;

    this.combatLockOn = false;

    // secondary classes
    this.abilityChecks = new AbilityChecks();
    this.penalties = new Penalties();
    this.exclusivePaths = new ExclusivePaths();
    this.combat = undefined;
    this.choicesOptions = new ChoicesOptions();

    //stores the important decisions made during the campaign
    this.relevantChoices = [];
  }

  playMusic(music: string = this.currentMusic) {
    this.currentMusic !== "" &&
      music !== this.currentMusic &&
      this.audioManager.stopMusic(this.currentMusic);
    this.audioManager.playMusic(music);
    this.currentMusic = music;
  }

  playSfx(soundName: string) {
    // this.currentSfx !== "" && this.audioManager.stopSFX(this.currentSfx);
    this.audioManager.playSfx(soundName);
    this.currentSfx = soundName;
  }

  stopAllMusic() {
    this.audioManager.resetAllAudio();
  }

  muteMusic() {
    this.audioManager.muteMusic();
  }

  resumeMusic() {
    this.audioManager.resumeMusic();
  }

  // THIS METHOD DETERMINES THE NEXT NODE BASED ON THE USER'S CHOICE.
  // IF THE NODE IS UNIQUE (PENALTY, ABILITY CHECKS, COMBAT), WE HANDLE IT HERE
  async determineNextNode(
    currentChoice: Choice,
    setChoiceResult: Dispatch<SetStateAction<ChoiceResult>>,
    clearNbOfTurn: (n: number) => void,
  ) {
    this.logUserChoices(currentChoice.text);

    let key: keyof Choice;
    // if the next node lead to  a special event (check, penalty, combat, etc), we put it in this variable
    // else we keep the normal next node and reset 'ChoiceResult' manually
    let nextNode = null;
    for (let key in currentChoice) {
      switch (key) {
        case "check":
          console.log("check")
          const check = this.abilityChecks.handler(currentChoice, this.node);
          if (check === null || check === undefined) return;
          this.playSfx("diceRollSound");

          if (check.result === false) {
            if (currentChoice.fail) {
              nextNode = currentChoice.fail;
            }
            setChoiceResult((prev: ChoiceResult) => ({
              ...prev,
              type: "ability",
              success: false,
              value: check.value,
              status: true,
            }));
          } else {
            nextNode = currentChoice.next;
            setChoiceResult((prev: ChoiceResult) => ({
              ...prev,
              type: "ability",
              success: true,
              value: check.value,
              status: true,
            }));
            this.accumulatedXp = this.accumulatedXp + (currentChoice.xp ?? 0);
          }
          break;

        case "penalty":
          console.log("penalty")
          this.penalties.handler(currentChoice, setChoiceResult);
          nextNode = currentChoice.next;
          break;

        case "combat_started":
          console.log("combat")
          // using bind() to pass the playSfx method from the AudioManager class
          // to the Combat class then to the useAttackAction without losing the context of 'this'
          this.combat = new Combat(
            this.playSfx.bind(this),
            this.playMusic.bind(this),
          );
          this.combat.preparingCombat(currentChoice, clearNbOfTurn);
          // this.playMusic("battleMusic");
          setChoiceResult((prev: ChoiceResult) => ({
            ...prev,
            success: null,
            value: null,
            status: false,
          }));
          nextNode = currentChoice.next;
          break;

        case "nodeRef":
          console.log("nodeRef")
          nextNode = this.exclusivePaths.handlingChoicesPaths(
            currentChoice,
            this.pastNodes,
          );
          setChoiceResult((prev: ChoiceResult) => ({
            ...prev,
            success: null,
            value: null,
            status: false,
          }));
          break;

        case "alt":
          console.log("alt")
          nextNode = this.exclusivePaths.handler(currentChoice);
          setChoiceResult((prev: ChoiceResult) => ({
            ...prev,
            success: null,
            value: null,
            status: false,
          }));
          break;

        case "campaignEnd":
          console.log("campaignend")
          this.relevantChoices = (currentChoice.relevantNodes ?? []).filter(
            (n: { node: string; text: string }) => {
              if (this.pastNodes.includes(n.node)) return n.text;
            },
          );
          this.accumulatedXp = this.accumulatedXp + 10;
          setChoiceResult((prev: ChoiceResult) => ({
            ...prev,
            success: null,
            value: null,
            status: false,
          }));
          nextNode = currentChoice.next;
          break;

        case "ost":
          console.log("ost")
          this.playMusic(currentChoice.ost);
          setChoiceResult((prev: ChoiceResult) => ({
            ...prev,
            success: null,
            value: null,
            status: false,
          }));
          nextNode = currentChoice.next;
          break;

 
      }
    }


    
    if (nextNode) {
      this.updateNode(nextNode);
    } else {
      setChoiceResult((prev: ChoiceResult) => ({
        ...prev,
        success: null,
        value: null,
        status: false,
      }));
      this.updateNode(currentChoice.next);
    }
  }

  //FOR COMBAT ONLY : IF THE PLAYER MAKES A MOVE, WE CALL THIS METHOD
  async handlePlayerCombatChoices(item: CombatItem) {
    if (!this.combat) return;

    // if the user open their inventory
    if ("text" in item && item.text === "inventory") {
      this.combat.inventoryHandler();
      return;
    }

    // if the user choose an attack or use a consumable item
    if (!this.combatLockOn) {
      this.combatLockOn = true;
      await this.combat
        .system(item, this.node)
        .then(() => (this.combatLockOn = false));
    }
  }

  // CLEANING THE RAW CHOICES TO DETERMINE WHICH ONES WE SHOULD DISPLAY TO THE USER BASED ON HIS PAST DECISIONS
  prepareChoicesForPlayer(
    setAllAvailableChoices: Dispatch<SetStateAction<Choice[] | undefined>>,
    choices: Choice[],
  ) {
    this.choicesOptions.handler(
      setAllAvailableChoices,
      choices,
      this.pastUserChoices,
    );
  }

  // we use this method to save the new user's data in the database at the end of the campaign
  async savingUserData(currentUser: User) {
    if (!currentUser?.user_id) return;
    const character = useCharacterStore.getState().character;

    const response = await fetch(`/api/character/${currentUser.user_id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        xp: character.xp,
        damage_taken: character.damage_taken,
        dopamine_consumed: character.dopamine_consumed,
        coins: character.coins,
      }),
    });
    const feedback = await response.json();
    if (!feedback.success) return { success: false };

    const inventory = useInventoryStore.getState().inventory;
    const inventoryResponse = await fetch(`/api/inventory/${currentUser.user_id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ inventory }),
    });
    const inventoryFeedback = await inventoryResponse.json();
    return inventoryFeedback.success ? { success: true } : { success: false };
  }

  // setter to update the node inside the class
  setNodeInsideEngine(node: string) {
    this.node = node;
    this.logPastNodes(node);
  }

  // getters to display the decisions made during the campaign and the total xp gained in the end screen
  getRelevantChoices() {
    return this.relevantChoices;
  }

  getAccumulatedXp() {
    return this.accumulatedXp;
  }

  logUserChoices(choice: string) {
    this.pastUserChoices.push(choice);
  }

  logPastNodes(node: string) {
    this.pastNodes.push(node);
  }
}
