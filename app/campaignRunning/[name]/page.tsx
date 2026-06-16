"use client";
import { useEffect, useRef } from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
import { useNarrationStore } from "@/stores/useNarrationStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Item, Moveset } from "@/types/types";
import itemsTemplate from "@/assets/items.json";
import movesetsTemplate from '@/assets/movesets.json';
import { usePathname } from "next/navigation";


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

  const pathname = usePathname();



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

  const inventoryBeforeCampaign = useInventoryStore((state) => state.inventory);
  const updateTempInventory = useCombatStore(
    (state) => state.updateTempInventory,
  );
  const tempInventory = useCombatStore((state) => state.tempInventory)
  const tempMovesets = useCombatStore((state) => state.tempMovesets)

  const movesetsBeforeCampaign = useCombatStore((state) => state.movesets);
  const updateMovesetsBeforeCampaign = useCombatStore((state)=> state.hydrateMovesets)
  const updateTempMovesets = useCombatStore(
    (state) => state.updateTempMovesets,
  );

  //We need to create a snapshot of the player's data in case they quit the campaign before the end
  //We should be able to reset his game data to a pre-campaign state
  function hydrateTempGameData() {
    //player's stats
    hydrateTempPlayerData({ ...character });
    const character_id = character.character_id;
    if (!character_id) return;

    //player's inventory
    if (!inventoryBeforeCampaign) return;
    const tempInv: Array<Item> = [];

    for (let i = 0; i < inventoryBeforeCampaign?.length; i++) {
      const matchingItem: Item | undefined = itemsTemplate.find(
        (n) => n.slug === inventoryBeforeCampaign[i].slug,
      );
      if (!matchingItem) {
        continue;
      } else {
        const userItem: Item = {
          ...matchingItem,
          quantity: inventoryBeforeCampaign[i].quantity,
          inventory_id:inventoryBeforeCampaign[i].inventory_id,
          equipped: inventoryBeforeCampaign[i].equipped
        };
        tempInv.push(userItem);
      }
    }
    updateTempInventory([...tempInv]);

    //player's movesets 
    const userInventoryAction: Moveset[] = [{ type: "action", name: "inventory", url:"icons/inventory.svg" }];


    //only display activated skill in the active movesets bar
    const onlyActivatedSkills = movesetsBeforeCampaign.filter(n => n.is_skill_activated);

    //find all the necessary moveset info from the template and add it in each skill
    let fullyDetailedSkills = [];
    for (let skill of onlyActivatedSkills) {
        const s = movesetsTemplate.find(n => n.name === skill.name) as Moveset;
        if (s) {
          s.character_id = character_id;
          s.is_skill_activated=true;
          fullyDetailedSkills.push(s)
        };
    };
    if (!fullyDetailedSkills) return;
    


    //safeguard if somehow the player have no basic or weapon skills in his set
    const basic_skill = movesetsBeforeCampaign.filter(n => n.type === "basic_skill" || n.type ==="weapon_skill");
    if (basic_skill.length <= 0) {
      console.log("adding safeguard skill")
      const added_basic_skill = character.race === "Felinois" ? movesetsTemplate[0] as Moveset : movesetsTemplate[1] as Moveset;
      added_basic_skill.character_id=character_id;
      added_basic_skill.is_skill_activated=true;
      fullyDetailedSkills.splice(0, 0, added_basic_skill);
    };
  
    //add the "inventory" move at the first position, always
    const userConcatMoves = userInventoryAction.concat(fullyDetailedSkills);

    //generating empty slots to keep it at 12 on-screen
    while (userConcatMoves.length < 12) {
      userConcatMoves.push({});
    };
    updateTempMovesets([...userConcatMoves]);
  };

  useEffect(() => {
    if (hasCampaignLaunched) return;
    Howler.unload(); // removing any Howl artefact to avoid duplicate music/sound during campaign
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
        // updateNode("remembering_how_to_fight");
        // updateNode("killing_regalus")
        setCampaignTitle(values.title);
        hydrateTempGameData();
      })
      .catch((err) => console.log("error: ", err));
  }, []);

  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
