'use client'
import { Press_Start_2P } from 'next/font/google';
import { useState } from 'react';
import Menu from '@/components/global/Menu'
import { useUserContext } from '@/context/context';

const PressStartFont = Press_Start_2P({
    subsets: ['latin'],
    weight:'400'
})

export default function Header() {

    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <>
        {/* menu */}
        <section 
        id="menu"
        className={!isMenuOpen ? 'z-999 fixed bg-black w-0 h-full overflow-hidden ' : 'z-999 fixed right-0 bg-black w-screen h-full overflow-hidden'}>
            <Menu setIsMenuOpenAction={setIsMenuOpen} />
        </section>

        {/* header */}
        
        <header className='flex py-5 mb-5 justify-between items-center'>
            <h1 className={`text-base! lg:text-2xl!  text-stone-300 ${PressStartFont.className}`}>Questmaker</h1>
            <svg 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className='max-w-8! lg:max-w-10! cursor-pointer'
                onClick={() => setIsMenuOpen(prev => !prev)}> 
                <path 
                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z" 
                    fill="currentColor"/> 
            </svg>
        </header>
        </>
    )
}