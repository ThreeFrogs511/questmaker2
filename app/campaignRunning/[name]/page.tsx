"use client";
import { useEffect, useRef } from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
import { useNarrationStore } from "@/stores/useNarrationStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Item, Moveset } from "@/types/types";
import items from "@/assets/items.json";

export default function CampaignRunning({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const flag = useRef(false);

  async function startNewCampaign() {
    if (flag.current) return;
    flag.current = true;
    const { name } = await params;

    const response = await fetch(`/campaigns/${name}.json`);
    const result = await response.json();
    return result;
  }

  // narration store
  const currentCampaign = useNarrationStore((state) => state.currentCampaign);
  const setCurrentCampaign = useNarrationStore(
    (state) => state.setCurrentCampaign,
  );
  const setCampaignTitle = useNarrationStore((state) => state.setCampaignTitle);
  const currentNode = useNarrationStore((state) => state.currentNode);
  const updateNode = useNarrationStore((state) => state.updateNode);

  const hasCampaignLaunched = currentCampaign && currentNode ? true : false;

  const character = useCharacterStore((state) => state.character);
  const hydrateTempPlayerData = useCombatStore(
    (state) => state.hydrateTempPlayerData,
  );

  const realInventoryModel = useInventoryStore((state) => state.inventory);
  const updateTempInventory = useCombatStore(
    (state) => state.updateTempInventory,
  );
  const tempInventory = useCombatStore((state) => state.tempInventory)

  const movesetsModel = useCombatStore((state) => state.movesets);
  const updateTempMovesets = useCombatStore(
    (state) => state.updateTempMovesets,
  );
  const hasAllDataBeenHydrated = useRef(false);

  //We need to create a snapshot of the player's data in case they quit the campaign before the end
  //We should be able to reset his game data to a pre-campaign state
  function hydrateTempGameData() {
    //player's stats
    hydrateTempPlayerData({ ...character });

    //player's inventory
    if (!realInventoryModel || hasAllDataBeenHydrated.current) return;
    const tempInv: Array<Item> = [];

    for (let i = 0; i < realInventoryModel?.length; i++) {
      const matchingItem: Item | undefined = items.find(
        (n) => n.slug === realInventoryModel[i].slug,
      );
      if (!matchingItem) {
        continue;
      } else {
        const userItem: Item = {
          ...matchingItem,
          quantity: realInventoryModel[i].quantity,
          inventory_id:realInventoryModel[i].inventory_id
        };
        tempInv.push(userItem);
      }
    }
    updateTempInventory([...tempInv]);

    //player's movesets 
    const userActions: Moveset[] = [{ type: "action", name: "inventory", url:"icons/inventory.svg" }];
    //insert logic for 'is_activated' skills
    const onlyActivatedSkills = movesetsModel.filter(n => n.is_skill_activated)
    const userConcatMoves = userActions.concat(onlyActivatedSkills);
    while (userConcatMoves.length < 12) {
      userConcatMoves.push({});
    }
    updateTempMovesets([...userConcatMoves]);
    hasAllDataBeenHydrated.current = true;
  };

  useEffect(() => {
    if (hasCampaignLaunched) return;

    startNewCampaign()
      .then((data) => {
        if (!data) return null;
        setCurrentCampaign(data.nodes);
        const firstNode = Object.keys(data.nodes)[0];
        const title = data.meta.title;
        const ost = data.meta.ost;
        return { firstNode, title, ost };
      })
      .then((values) => {
        if (!values) return;
        updateNode(values.firstNode);
        updateNode("remembering_how_to_fight");
        setCampaignTitle(values.title);
        hydrateTempGameData();
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log(tempInventory)
  }, [tempInventory])


  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
