'use client'
import Link from "next/link";
import { useUserContext } from "@/context/context";
import { Card, Button } from 'pixel-retroui';
import { useRouter } from 'next/navigation';



export default function Menu({setIsMenuOpenAction} : {
    setIsMenuOpenAction: React.Dispatch<React.SetStateAction< boolean >>
}) {

   const router = useRouter();
   
    async function logout() {
       
        setIsMenuOpenAction(false);
       const response = await fetch('api/logout', {
            method: 'DELETE'
        });
        const feedback = await response.json();
        feedback.success && router.push('/login');
    }

    return(
        <>
        <div className=" relative h-full w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 
        max-w-[1600px] mx-auto flex items-end">
            <nav 
                className="h-[90%] flex flex-col justify-evenly items-center w-full px-4 
                sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 max-w-[1600px] mx-auto">
                <Link href='/journal'className="w-full flex justify-center" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4">
                        <p className="font-minecraft text-4xl p-5 ">Journal</p>
                    </Button> 
                </Link> 
                <Link href='/profile'className="w-full flex justify-center" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4">
                        <p className="font-minecraft text-4xl  p-5 ">Profile</p>
                    </Button> 
                </Link> 
                <Link href='#'className="w-full flex justify-center" onClick={() => setIsMenuOpenAction(prev => !prev)}> 
                    <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4">
                        <p className="font-minecraft text-4xl  p-5 ">Settings</p>
                    </Button> 
                </Link> 
               <div className="w-full flex justify-center" onClick={logout}> 
                    <Button  textColor="white" bg="transparent" borderColor="white" shadow="white" className="w-3/4">
                        <p className="font-minecraft text-4xl p-5">Logout</p>
                    </Button> 
                </div> 
            </nav>
            <div 
                className="absolute top-5 right-5
                cursor-pointer size-8" 
                onClick={() => setIsMenuOpenAction(prev => !prev)}>
                    <img src="/icons/close.svg" alt="closing menu icon" />
            </div>
        </div>
        </>
    )
}