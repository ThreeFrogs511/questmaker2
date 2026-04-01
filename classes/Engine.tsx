'use client'
// describe the 'nodes' global object

import type { Dispatch, SetStateAction } from 'react'
import { Nodes, User, Choice, Data, CombatItem } from '@/types/types'
import AbilityChecks from "./AbilityChecks";
import Penalties from "./Penalties";
import ExclusivePaths from "./ExclusivePaths";
import Combat from "./CombatSystem/Combat";
import ChoicesOptions from "./Choices";

import { useNarrationStore } from '@/stores/useNarrationStore';
import { useInventoryStore } from '@/stores/useInventoryStore';

export default class Engine {

  // main attributes
  private node;
  private updateNode;

  // campaign attribute
  private relevantChoices: Array<{ node: string; text: string }>;
  private accumulatedXp: number;

  // class workers
  private abilityChecks;
  private penalties;
  private exclusivePaths;
  private combat: Combat | undefined;
  private choicesOptions;

  // combat
  combatLockOn: boolean;

  constructor(node: keyof Nodes | undefined,) {

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
    this.choicesOptions = new ChoicesOptions()

    //stores the important decisions made during the campaign
    this.relevantChoices = [];

  }


  // THIS METHOD DETERMINES THE NEXT NODE BASED ON THE USER'S CHOICE.
  // IF THE NODE IS UNIQUE (PENALTY, ABILITY CHECKS, COMBAT), WE HANDLE IT HERE
  async determineNextNode(currentChoice: Choice, setData: Dispatch<SetStateAction<Data>>, userPastNodes: string[], clearNbOfTurn: (n: number) => void) {

    // ability checks
    if (currentChoice.check) {
      const check = this.abilityChecks.handler(currentChoice, this.node);
      if (check === null || check === undefined) return;
      if (check.result === false) {
        if (currentChoice.fail) {
          this.updateNode(currentChoice.fail);
        }
        setData((prev: Data) => ({ ...prev, type: 'ability', success: false, value: check.value, status: true }));
      } else {
        this.updateNode(currentChoice.next);
        setData((prev: Data) => ({ ...prev, type: 'ability', success: true, value: check.value, status: true }));
        this.accumulatedXp = this.accumulatedXp + (currentChoice.xp ?? 0);
      };

      //penalties
    } else if (currentChoice.penalty) {
      this.penalties.handler(currentChoice, setData);
      this.updateNode(currentChoice.next);

      //exclusive dialog, choice options
    } else if (currentChoice.alt) {
      const nextNode = this.exclusivePaths.handler(currentChoice, this.updateNode);
      this.updateNode(nextNode);
      setData((prev: Data) => ({ ...prev, success: null, value: null, status: false }));

      // launching combat
    } else if (currentChoice.combat_started) {
      this.combat = new Combat();
      this.combat.preparingCombat(currentChoice, clearNbOfTurn);
      this.updateNode(currentChoice.next);

      //exclusive dialog, choices based on the user's past decisions
    } else if (currentChoice.nodeRef) {
      const nextNode = this.exclusivePaths.handlingChoicesPaths(currentChoice, userPastNodes);
      this.updateNode(nextNode);
      setData((prev: Data) => ({ ...prev, success: null, value: null, status: false }));

      //launching the end screen, displaying the relevant decisions made by the user
    } else if (currentChoice.campaignEnd) {
      this.relevantChoices = (currentChoice.relevantNodes ?? []).filter((n: { node: string; text: string }) => {
        if (userPastNodes.includes(n.node)) {
          return n.text;
        };
      });
      this.accumulatedXp = this.accumulatedXp + 10;
      this.updateNode(currentChoice.next);

      //normal nodes
    } else {
      this.updateNode(currentChoice.next);
      setData((prev: Data) => ({ ...prev, success: null, value: null, status: false }));
    }
  }

  //FOR COMBAT ONLY : IF THE PLAYER MAKES A MOVE, WE CALL THIS METHOD
  async handlePlayerCombatChoices(item: CombatItem, setSoundEffect: (effect: string) => void) {
    if (!this.combat) return;

    // if the user open their inventory
    if ('text' in item && item.text === "inventory") {
      this.combat.inventoryHandler();
      return;
    };

    // if the user choose an attack or use a consumable item
    if (!this.combatLockOn) {
      this.combatLockOn = true;
      await this.combat.system(item, this.node, setSoundEffect)
        .then(() => this.combatLockOn = false);
    }
  }

  // CLEANING THE RAW CHOICES TO DETERMINE WHICH ONES WE SHOULD DISPLAY TO THE USER BASED ON HIS PAST DECISIONS
  prepareChoicesForPlayer(setAllAvailableChoices: Dispatch<SetStateAction<Choice[] | undefined>>, choices: Choice[], userPastChoices: string[]) {
    this.choicesOptions.handler(setAllAvailableChoices, choices, userPastChoices);
  }

  // we use this method to save the new user's data in the database at the end of the campaign
  async savingUserData(currentUser: User) {
    if (!currentUser) return;
    const response = await fetch(`/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/JSON' },
      body: JSON.stringify(currentUser)
    });
    const feedback = await response.json();
    if (!feedback.success) return { success: false };

    const inventory = useInventoryStore.getState().inventory;
    const inventoryResponse = await fetch(`/api/inventory/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ inventory })
    });
    const inventoryFeedback = await inventoryResponse.json();
    if (inventoryFeedback.success) {
      return { success: true }
    } else {
      return { success: false }
    }
  }

  // setter to update the node inside the class 
  setNodeInsideEngine(node: string) {
    this.node = node;
  }

  // getters to display the decisions made during the campaign and the total xp gained in the end screen
  getRelevantChoices() {
    return this.relevantChoices;
  }

  getAccumulatedXp() {
    return this.accumulatedXp;

  }
}

