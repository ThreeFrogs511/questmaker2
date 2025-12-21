'use client'

import { ProgressBar } from 'pixel-retroui';

import { useUserStore } from '@/stores/useUserStore';

export default function Bar() {

    const currentUser = useUserStore(state => state.currentUser);

    return(
        <>
            <ProgressBar
                size="md"
                color="blue"
                borderColor="white"
                className="w-full"
                progress={(currentUser && currentUser.dopamine) ? 
                (currentUser.dopamine/currentUser.dopamine_consumed)*100-currentUser.dopamine_consumed : 0}
            />
        </>
    )
}