'use client'
import { Button } from "pixel-retroui"
import { useRouter } from 'next/navigation';


export default function CampaignMenuScreen({selectedCampaign, setHasChosenACampaignAction} : {
    selectedCampaign:{id:number;name:string;mongo_id:string;description:string;} |undefined,
    setHasChosenACampaignAction:React.Dispatch<React.SetStateAction<boolean>>,
}) {

    const router = useRouter();

    
    return(
        <>
        <section 
        className={` bg-black h-dvh flex flex-col justify-evenly items-center w-full top-0 left-0 bottom-0 right-0`}>
            <div>
                <h1 className="text-4xl! font-minecraft mb-5! text-amber-400 tracking-widest text-center">{selectedCampaign?.name}</h1>
                <h2 className="text-xl! font-minecraft tracking-widest">{selectedCampaign?.description}</h2>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className={`p-5! text-xl lg:text-3xl! `}
                onPointerDown={() =>  {
                    router.push(`/campaignRunning/${selectedCampaign?.mongo_id}`)
                }}>
                    Begin your story
                </Button>
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                shadow="white"
                className={`p-5! text-xl lg:text-3xl! `}
                onPointerDown={() =>  {
                    setHasChosenACampaignAction(false);
                }}>
                    Return
                </Button>
                </div>
        </section>
        </>
    )
}