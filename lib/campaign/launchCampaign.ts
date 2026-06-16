
import { useNarrationStore } from "@/stores/useNarrationStore";
export default async function launchCampaign() {
  const currentCampaign = useNarrationStore.getState().currentCampaign;
  const setCurrentCampaign = useNarrationStore.getState().setCurrentCampaign;
  const setCampaignTitle = useNarrationStore.getState().setCampaignTitle;
  const currentNode = useNarrationStore.getState().currentNode;
  const updateNode = useNarrationStore.getState().updateNode;
  try {
    // console.log("launchCampaign activated!")
    const response = await fetch(`http://localhost:3000/campaigns/a_terrible_hangover.json`);
    // console.log("response:", response)
    const campaign = await response.json();
    // console.log(campaign)

    if (!campaign) return "issou";

    setCurrentCampaign(campaign.nodes);
    const firstNode = Object.keys(campaign.nodes)[0];
    const campaignTitle = campaign.meta.title;
    updateNode(firstNode);
    setCampaignTitle(campaignTitle);

    if (currentCampaign && currentNode) {
        return true
    } else {
        return false;
    };

  } catch (err)  {
    return (err as Error).message;
  }
}
