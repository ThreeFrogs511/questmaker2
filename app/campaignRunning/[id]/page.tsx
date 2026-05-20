"use client";
import { useEffect} from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
// main types
import { useNarrationStore } from "@/stores/useNarrationStore";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/context";

export default function CampaignRunning({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { isAuthenticated, isProfileCompleted } = useUserContext();

  async function startNewCampaign() {
    // const { id } = await params;

    // if (!id) router.back();

    // const response = await fetch(`/api/campaigns/${id}`);
    // const result = await response.json();

    const response = await fetch(`/a_terrible_hangover_BACKUP.json`);
    const result = await response.json();
    return result;
  }

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

  if (!isAuthenticated || !isProfileCompleted) {
    return <Loading />;
  }
  return <>{hasCampaignLaunched ? <CampaignHandler /> : <Loading />}</>;
}
