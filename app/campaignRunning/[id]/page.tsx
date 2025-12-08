'use client'
import { useEffect, useRef, useState} from "react";
import { useUserContext } from "@/context/context";
import CampaignHandler from "@/components/Campaigns/CampaignHandler";
// main types
import { Nodes, Node, Choice } from "@/components/Campaigns/NodeTypes";


export default function campaignRunning({params} : {params: Promise<{ id: string }>}) {


async function startNewCampaign() {
    const {id} = await params;
    if (!id) throw new Error('No campaign id selected');

    const response = await fetch(`/api/campaigns/${id}`);
    const result = await response.json();

    console.log(result)

    return result;
}

    const [currentCampaign, setCurrentCampaign] = useState<Nodes>();
    // current node aka current scene
    const [currentNode, setCurrentNode] = useState<keyof Nodes | undefined>();

    const [currentCampaignTitle, setCurrentCampaignTitle] = useState<string>();

    const [isCampaignLaunched, setIsCampaignLaunched] = useState(false);

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
            // setCurrentNode(values.first);
            setCurrentNode("remembering_how_to_fight")
            setCurrentCampaignTitle(values.title);
            })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (currentCampaign && currentNode) setIsCampaignLaunched(true);
    }, [currentCampaign, currentNode])

    return (
        <>
        {isCampaignLaunched ?
        <CampaignHandler 
        currentNode={currentNode} 
        currentCampaign={currentCampaign} 
        setCurrentNodeAction={setCurrentNode}
        currentCampaignTitle={currentCampaignTitle}/> : <h3>Loading</h3>}
        </>
    )
}