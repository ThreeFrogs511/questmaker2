"use client";
import { useEffect, useRef } from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
import { useNarrationStore } from "@/stores/useNarrationStore";
import { useCombatStore } from "@/stores/useCombatStore";
import { useCharacterStore } from "@/stores/useCharacterStore";

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

  const character = useCharacterStore((state)=>state.character);
  const hydrateTempPlayerData = useCombatStore((state)=> state.hydrateTempPlayerData);

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
        // updateNode("remembering_how_to_fight")
        setCampaignTitle(values.title);
        hydrateTempPlayerData(character);
      })
      .catch((err) => console.log(err));

  }, []);

  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
