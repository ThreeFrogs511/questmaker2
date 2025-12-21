import { ProgressBar } from 'pixel-retroui';
import { useUserStore } from '@/stores/useUserStore';

export default function Bar() {

    const currentUser = useUserStore(state => state.currentUser);

    return(
        <>
         <ProgressBar
            size="md"
            color="green"
            borderColor="white"
            className="w-full"
            progress={currentUser && currentUser.xp ? currentUser.xp : 0}
            />
        </>
    )
}