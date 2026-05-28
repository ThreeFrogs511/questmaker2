
'use client'
import { useUserContext } from "@/context/context"
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function Footer() {


    return(
        <>
 
        <footer className={`py-3 ${retroGaming.className}`}>
            <p className="text-center text-xs!">Copyright 2025 - Questmaker</p>
        </footer>
        
        </>
    )
}