import { ProgressBar } from 'pixel-retroui';
import { useCharacterStore } from '@/stores/useCharacterStore';

export default function Bar() {

    const character = useCharacterStore(state => state.character);

    return(
        <>
        <div className="xpBar">
            <ProgressBar
            size="sm"
            color="green"
            borderColor="white"
            className="w-full transition-width! duration-700! ease-in-out!"
            progress={character?.xp ?? 0}
            />
        </div>
        </>
    )
}