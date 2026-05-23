"use client";
import { useEffect} from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
// main types
import { useNarrationStore } from "@/stores/useNarrationStore";


export default function CampaignRunning({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  async function startNewCampaign() {
    const response = await fetch(`/a_terrible_hangover_BACKUP.json`);
    const result = await response.json();
    return result;
  };

  // narration store
  const currentCampaign = useNarrationStore((state) => state.currentCampaign);
  const setCurrentCampaign = useNarrationStore((state) => state.setCurrentCampaign);
  const setCampaignTitle = useNarrationStore((state) => state.setCampaignTitle);
  const currentNode = useNarrationStore((state) => state.currentNode);
  const updateNode = useNarrationStore((state) => state.updateNode);

  const hasCampaignLaunched = currentCampaign && currentNode ? true : false;

  useEffect(() => {
    if (hasCampaignLaunched) return;
    startNewCampaign()
      .then((data) => {
        setCurrentCampaign(data.nodes);
        const firstNode = Object.keys(data.nodes)[0];
        const title = data.meta.title;
        const values = { firstNode: firstNode, title: title };
        return values;
      })
      .then((values) => {
        updateNode(values.firstNode);
        // updateNode("remembering_how_to_fight")
        setCampaignTitle(values.title);
      })
      .catch((err) => console.log(err));
  });

 
  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
