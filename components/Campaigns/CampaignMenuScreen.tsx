'use client'
import { Button } from "pixel-retroui"
export default function CampaignMenuScreen({setIsStartedAction, isStarted} : {
    setIsStartedAction:React.Dispatch<React.SetStateAction<boolean>>,
    isStarted:boolean
}) {


    
    return(
        <>
        <section 
        className={`fixed bg-black h-full flex justify-center items-center w-full top-0 left-0 bottom-0 right-0`}>
            <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            className={`p-5! text-xl lg:text-3xl! w-[90%] lg:w-[60%]`}
            onPointerDown={() =>  {
                setIsStartedAction(true);
            }}>
                Begin your story
            </Button>
        </section>
        </>
    )
}