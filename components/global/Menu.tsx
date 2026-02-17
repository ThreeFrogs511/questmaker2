'use client'
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";
import { usePathname } from "next/navigation";


export default function Menu() {

   const router = useRouter();
   const style = "font-minecraft text-3xl! sm:text-3xl! md:ml-10!";
   const setIsMenuOpen = useUserStore(state => state.setIsMenuOpen);
    const pathname = usePathname();

    async function logout() {
        setIsMenuOpen(false);
        const response = await fetch('api/logout', {
                method: 'DELETE'
        });
        const feedback = await response.json();
        feedback.success && router.push('/titleScreen');
    };

    function navigationHandler(destination:string) {
        if (pathname === destination) {
            setIsMenuOpen(false);
        } else {
            router.push(destination);
        }
    };

    return(
        <>
        <div className=" relative h-full w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 
        max-w-400 mx-auto flex items-end">
            <nav 
            className="h-[95%] max-h-full! flex flex-col gap-15 md-gap-5! justify-center! md:justify-center! items-center w-full px-4
            sm:px-1 md:px-5 lg:px-20 xl:px-40 2xl:px-60 max-w-400 mx-auto"
            >
                {/* journal */}
                <div onPointerDown={() => navigationHandler("/journal")} className=" cursor-pointer w-full flex hover:text-amber-300!"> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Journal</p>
                    {/* </Button>  */}
                </div> 

                {/* Campaigns */}
                <div onPointerDown={() => navigationHandler("/campaignList")} className="cursor-pointer w-full flex hover:text-amber-300!"> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Campaigns</p>
                    {/* </Button>  */}
                </div> 

                {/* Character Sheet */}
                <div onPointerDown={() => navigationHandler("/characterSheet")}className="cursor-pointer w-full flex hover:text-amber-300!"> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Character Sheet</p>
                    {/* </Button>  */}
                </div> 

                {/* inventory*/}
                <div onPointerDown={() => navigationHandler("/inventory")} className="cursor-pointer w-full flex hover:text-amber-300!"> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Inventory</p>
                    {/* </Button>  */}
                </div> 

                {/* Settings */}
                <div onPointerDown={() => navigationHandler("/profileSettings")} className="cursor-pointer w-full flex hover:text-amber-300!"> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Profile Settings</p>
                    {/* </Button>  */}
                </div> 


                {/* logout */}
                <div className="w-full flex cursor-pointer hover:text-amber-300" onPointerDown={logout}> 
                    {/* <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4"> */}
                        <p className={style}>Logout</p>
                    {/* </Button>  */}
                </div> 
            </nav>
        </div>
        </>
    )
}