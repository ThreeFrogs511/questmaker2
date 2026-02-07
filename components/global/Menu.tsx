'use client'
import Link from "next/link";
import { useRouter } from 'next/navigation';



export default function Menu({setIsMenuOpenAction} : {
    setIsMenuOpenAction: React.Dispatch<React.SetStateAction< boolean >>
}) {

   const router = useRouter();
   const style = "font-minecraft text-3xl! sm:text-3xl! md:ml-10!"
    async function logout() {
        setIsMenuOpenAction(false);
        const response = await fetch('api/logout', {
                method: 'DELETE'
        });
        const feedback = await response.json();
        feedback.success && router.push('/titleScreen');
    }

    return(
        <>
        <div className=" relative h-full w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 
        max-w-[1600px] mx-auto flex items-end">
            <nav 
            className="h-[95%] max-h-full! flex flex-col gap-15 md-gap-5! justify-center! md:justify-center! items-center w-full px-4
            sm:px-1 md:px-5 lg:px-20 xl:px-40 2xl:px-60 max-w-[1600px] mx-auto"
            >
                {/* journal */}
                <Link href='/journal'className="w-full flex hover:text-amber-300!" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Journal</p>
                    {/* </Button>  */}
                </Link> 

                {/* Campaigns */}
                <Link href='/campaignList'className="w-full flex hover:text-amber-300!" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Campaigns</p>
                    {/* </Button>  */}
                </Link> 

                {/* Character Sheet */}
                <Link href='/characterSheet'className="w-full flex hover:text-amber-300!" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Character Sheet</p>
                    {/* </Button>  */}
                </Link> 

                {/* inventory*/}
                <Link href='/inventory'className="w-full flex hover:text-amber-300!" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Inventory</p>
                    {/* </Button>  */}
                </Link> 

                {/* Settings */}
                <Link href='/profileSettings'className="w-full flex hover:text-amber-300!" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Profile Settings</p>
                    {/* </Button>  */}
                </Link> 


                {/* logout */}
                <div className="w-full flex cursor-pointer hover:text-amber-300" onClick={logout}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Logout</p>
                    {/* </Button>  */}
                </div> 
            </nav>

            {/* close icon */}
            <div 
                className="absolute top-5 lg:right-20! right-4!
                cursor-pointer size-8" 
                onClick={() => setIsMenuOpenAction(prev => !prev)}>
                    <img src="/icons/close.svg" alt="closing menu icon" />
            </div>
        </div>
        </>
    )
}