"use client";
import { useEffect, useRef, useCallback } from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
import { useNarrationStore } from "@/stores/useNarrationStore";


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
        // updateNode("introducing_to_mayor")
        setCampaignTitle(values.title);
      })
      .catch((err) => console.log(err));

  }, []);

  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
