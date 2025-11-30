'use client'
import CampaignHandler from "@/components/Campaigns/CampaignHandler";
import CampaignTitle from "@/components/Campaigns/CampaignMenuScreen"
import {useState} from 'react';

export default function campaignPage() {

  // launches the campaign
  const [isStarted, setIsStarted] = useState(false);

  return(
    <>
 
    {!isStarted ? 
    <CampaignTitle setIsStartedAction={setIsStarted} isStarted={isStarted} />  :
    <CampaignHandler />}

    
    </>
  )
}

