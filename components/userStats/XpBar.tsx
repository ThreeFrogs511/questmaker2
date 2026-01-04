import { ProgressBar } from 'pixel-retroui';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';

export default function Bar() {

    const currentUser = useUserStore(state => state.currentUser);

    
    return(
        <>
        <div className="xpBar">
            <ProgressBar
            size="md"
            color="green"
            borderColor="white"
            className="w-full transition-width! duration-700! ease-in-out!"
            progress={currentUser && currentUser.xp ? currentUser.xp : 0}
            />
        </div>
        </>
    )
}