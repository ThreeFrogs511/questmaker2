import { ProgressBar } from 'pixel-retroui';
import { useUserContext } from '@/context/context';
import { useEffect, useState } from 'react';

export default function Bar() {

    const {currentUser} = useUserContext();

    return(
        <>
         <ProgressBar
            size="md"
            color="red"
            borderColor="white"
            className="w-full"
            progress={currentUser.hp ? (currentUser.hp/currentUser.hp)*100-currentUser.damage_taken : 0}
            />
        </>
    )
}