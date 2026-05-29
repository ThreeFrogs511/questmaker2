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
  private pastNodes:Array<string | undefined>=[]
  private pastUserChoices:Array<string | undefined>=[]

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

    // ability checks
    if (currentChoice.check) {
      const check = this.abilityChecks.handler(currentChoice, this.node);
      if (check === null || check === undefined) return;
      this.playSfx("diceRollSound");

      if (check.result === false) {
        if (currentChoice.fail) {
          this.updateNode(currentChoice.fail);
        }
        setChoiceResult((prev: ChoiceResult) => ({
          ...prev,
          type: "ability",
          success: false,
          value: check.value,
          status: true,
        }));
      } else {
        this.updateNode(currentChoice.next);
        setChoiceResult((prev: ChoiceResult) => ({
          ...prev,
          type: "ability",
          success: true,
          value: check.value,
          status: true,
        }));
        this.accumulatedXp = this.accumulatedXp + (currentChoice.xp ?? 0);
      }

      //penalties
    } else if (currentChoice.penalty) {
      this.penalties.handler(currentChoice, setChoiceResult);
      this.updateNode(currentChoice.next);

      //exclusive dialog/choice options based on race/class/gender
    } else if (currentChoice.alt) {
      console.log("handling exclusive path");
      const nextNode = this.exclusivePaths.handler(currentChoice);
      this.updateNode(nextNode);
      setChoiceResult((prev: ChoiceResult) => ({
        ...prev,
        success: null,
        value: null,
        status: false,
      }));

      // launching combat
    } else if (currentChoice.combat_started) {
      // using bind() to pass the playSfx method from the AudioManager class
      // to the Combat class then to the useAttackAction without losing the context of 'this'
      this.combat = new Combat(
        this.playSfx.bind(this),
        this.playMusic.bind(this),
      );
      this.combat.preparingCombat(currentChoice, clearNbOfTurn);
      this.updateNode(currentChoice.next);
      this.playMusic("battleMusic");

      //exclusive dialog, choices based on the user's past decisions in this chapter
    } else if (currentChoice.nodeRef) {
      const nextNode = this.exclusivePaths.handlingChoicesPaths(
        currentChoice,
        this.pastNodes,
      );
      this.updateNode(nextNode);
      setChoiceResult((prev: ChoiceResult) => ({
        ...prev,
        success: null,
        value: null,
        status: false,
      }));

      //launching the end screen, displaying the relevant decisions made by the user
    } else if (currentChoice.campaignEnd) {
      this.relevantChoices = (currentChoice.relevantNodes ?? []).filter(
        (n: { node: string; text: string }) => {
          if (this.pastNodes.includes(n.node)) {
            return n.text;
          }
        },
      );
      this.accumulatedXp = this.accumulatedXp + 10;
      this.updateNode(currentChoice.next);

      //normal nodes
    } else if (currentChoice.ost) {
      this.playMusic(currentChoice.ost);
      this.updateNode(currentChoice.next);
      setChoiceResult((prev: ChoiceResult) => ({
        ...prev,
        success: null,
        value: null,
        status: false,
      }));
    } else {
      this.updateNode(currentChoice.next);
      setChoiceResult((prev: ChoiceResult) => ({
        ...prev,
        success: null,
        value: null,
        status: false,
      }));
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
    if (!currentUser) return;
    if (!currentUser.id) console.log("no user id found for saving data");
    const response = await fetch(`/api/users/${currentUser.id}`, {
      method: "PUT",
      headers: { "content-type": "application/JSON" },
      body: JSON.stringify(currentUser),
    });
    const feedback = await response.json();
    if (!feedback.success) return { success: false };

    const inventory = useInventoryStore.getState().inventory;
    const inventoryResponse = await fetch(`/api/inventory/${currentUser.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ inventory }),
    });
    const inventoryFeedback = await inventoryResponse.json();
    if (inventoryFeedback.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  }

  // setter to update the node inside the class
  setNodeInsideEngine(node: string) {
    this.node = node;
    this.logPastNodes(node)
  }

  // getters to display the decisions made during the campaign and the total xp gained in the end screen
  getRelevantChoices() {
    return this.relevantChoices;
  }

  getAccumulatedXp() {
    return this.accumulatedXp;
  }

  logUserChoices(choice:string) {
    this.pastUserChoices.push(choice);
  };

  logPastNodes(node:string) {
    this.pastNodes.push(node);
  }
}
