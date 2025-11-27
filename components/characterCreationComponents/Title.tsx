'use client'
import { useState } from "react";

export default function Title({indexTitle, setIndexTitleAction} : {
    indexTitle:number,
    setIndexTitleAction:React.Dispatch<React.SetStateAction<number>>
}) {

    const title = ["IDENTITY", "RACE", "CLASS", "ABILITIES", "SUMMARY"];
    return(
        <>
        <div className="flex justify-between items-center row-span-1">
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
            className={`size-10 cursor-pointer shrink-0 ${indexTitle>0 ? 'text-white' : 'text-black pointer-events-none'}`}
            onPointerDown={() => setIndexTitleAction(prev => prev ===0 ? 0 : prev-1)}> 
                <path d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12zM10 7H8v2h2V7zm0 0h2V5h-2v2zm0 10H8v-2h2v2zm0 0h2v2h-2v-2z" 
                fill="currentColor"/> 
            </svg>
            <h2 
            className="lg:w-1/2 xl:w-1/2 2xl:w-1/2 text-xl! sm:text-xl! md:text-2xl! lg:text-3xl! 
            xl:text-3xl! 2xl:text-4xl! 
            tracking-widest text-center font-minecraft">
                {title[indexTitle]}
            </h2>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
            className={`size-10 cursor-pointer shrink-0 ${indexTitle<4 ? 'text-white' : 'text-black pointer-events-none'}`}
            onPointerDown={() => setIndexTitleAction(prev => prev ===4 ? 4 : prev+1)}> 
            <path d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z" 
            fill="currentColor"/> 
            </svg>
        </div>
        </>
    )
}