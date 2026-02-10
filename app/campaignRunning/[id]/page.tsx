'use client'
import { useEffect,  useState} from "react";
import CampaignHandler from "@/components/campaign/Global/CampaignHandler";
import Loading from "@/app/loading";
// main types
import { useNarrationStore } from "@/stores/useNarrationStore";


export default function CampaignRunning({params} : {params: Promise<{ id: string }>}) {


    async function startNewCampaign() {
        const {id} = await params;
        if (!id) throw new Error('No campaign id selected');

        const response = await fetch(`/api/campaigns/${id}`);
        const result = await response.json();

        return result;
    }

    // narration store
    const currentCampaign = useNarrationStore(state => state.currentCampaign);
    const setCurrentCampaign = useNarrationStore(state => state.setCurrentCampaign);
    const setCampaignTitle = useNarrationStore(state => state.setCampaignTitle);
    const currentNode = useNarrationStore(state => state.currentNode);
    const updateNode = useNarrationStore(state => state.updateNode);

    const [hasCampaignLaunched, setHasCampaignLaunched] = useState(false);

    useEffect(() => {
        startNewCampaign()
        .then(data => { 
        setCurrentCampaign(data.nodes);
        const first = Object.keys(data.nodes)[0];
        const title = data.meta.title;
        const values = {first:first, title:title};
        return values;
        })
        .then(values => { 
            // updateNode(values.first);
            updateNode("remembering_how_to_fight")
            setCampaignTitle(values.title);
            })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (currentCampaign && currentNode) setHasCampaignLaunched(true);
    }, [currentCampaign, currentNode])

    return (
        <>
            {hasCampaignLaunched ? <CampaignHandler /> : <Loading />}
        </>
    )
}