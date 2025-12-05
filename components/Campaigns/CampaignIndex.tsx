'use client'
import { Card, Button } from "pixel-retroui"

type List = {
    id:number;
    name:string;
    mongo_id:string;
    description:string;
}
export default function CampaignIndex({campaignList, setHasChosenACampaignAction, setSelectedCampaignAction}: {
    campaignList:List[],
    setHasChosenACampaignAction:React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedCampaignAction:React.Dispatch<React.SetStateAction<List | undefined>>}) {

    return (
   
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {campaignList.map(c => (
            <Card
                key={c.id}
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="p-4 flex flex-col gap-5 items-center"
            >
                <h2 className="text-2xl! text-amber-400">{c.name}</h2>
                <p className="text-center tracking-widest">{c.description}</p>
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className="w-[70%] py-2"
                onPointerDown={() => {
                    setSelectedCampaignAction(c);
                    setHasChosenACampaignAction(true);
                }}
                >
                View
                </Button>
            </Card>
            ))}
        </div>
    )
}