'use client'
import { Button, Card } from "pixel-retroui"
import { useEffect, useState, useRef } from "react"
import CampaignIndex from "@/components/Campaigns/CampaignIndex"
import CampaignMenuScreen from "@/components/Campaigns/CampaignMenuScreen"

export default function campaignList() {

    type List = {
        id:number;
        name:string;
        mongo_id:string;
        description:string;
    }

    const [campaignList, setCampaignList] = useState<List[]>([]);
    const [isListFetched, setIsListFetched] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<List>();
    const [hasChosenACampaign, setHasChosenACampaign] = useState(false);

    useEffect(() => {
        fetch(`api/campaigns/list`)
        .then(r => r.json())
        .then(data => setCampaignList(data))
        .then(() => setIsListFetched(true))
        .catch((err) => console.log(err));
    }, [])


 const campaigns = [
    { id: 1, name: "Curse of Strahd" },
    { id: 2, name: "Storm King’s Thunder" },
    { id: 3, name: "Descent Into Avernus" },
    { id: 4, name: "Tomb of Annihilation" },
    { id: 5, name: "Out of the Abyss" },
  ]

  return (
    <>
       { 
        !hasChosenACampaign ?
        <div className="min-h-screen w-full bg-black text-white px-6 py-10 font-mono">
            <h1 className="text-center text-3xl! tracking-wide mb-10! font-minecraft">
            Select your campaign
            </h1>

            { isListFetched ? 
            <CampaignIndex campaignList={campaignList} 
            setHasChosenACampaignAction={setHasChosenACampaign} 
            setSelectedCampaignAction={setSelectedCampaign}/> : <h3>Loading</h3>
            }
        </div>
        : <CampaignMenuScreen 
        selectedCampaign={selectedCampaign} 
        setHasChosenACampaignAction={setHasChosenACampaign}
        />
        }
    </>
    
  )
}