'use client'
import useSound from "use-sound";

export default function itemSounds() {
     const [drinkPotion] = useSound('/sounds/potion.mp3');

    return drinkPotion();
}