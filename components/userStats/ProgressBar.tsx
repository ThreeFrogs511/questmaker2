import { ProgressBar } from 'pixel-retroui';
import { useUserContext } from '@/context/context';

export default function Bar() {

    const {currentUser, setCurrentUser} = useUserContext();

    return(
        <>
         <ProgressBar
            size="md"
            color="green"
            borderColor="white"
            className="w-full"
            progress={currentUser.xp ? currentUser.xp : 0}
            />
        </>
    )
}