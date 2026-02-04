'use client'
import { useEffect, useState} from "react"
import CampaignIndex from "@/components/campaign/CampaignIndex"
import CampaignMenuScreen from "@/components/campaign/CampaignMenuScreen"
import Header from "@/components/global/Header"
import Footer from "@/components/global/Footer"
import Loading from "../loading"

export default function CampaignList() {

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



  return (
    <>
    <div className="wrapper">
        <Header />
       { 
        !hasChosenACampaign ?
        <div className="h-full w-full bg-black text-white px-6 py-10 font-mono">
            <h1 className="text-center text-2xl! md:text-3xl! tracking-wide mb-10! font-minecraft">
            Select your campaign
            </h1>

            { isListFetched ? 
            <CampaignIndex campaignList={campaignList} 
            setHasChosenACampaignAction={setHasChosenACampaign} 
            setSelectedCampaignAction={setSelectedCampaign}/> : <Loading />
            }
        </div>
        : <CampaignMenuScreen 
        selectedCampaign={selectedCampaign} 
        setHasChosenACampaignAction={setHasChosenACampaign}
        />
        }
        <Footer />
    </div>
    </>
    
  )
}