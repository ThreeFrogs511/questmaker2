'use client'
import useSound from "use-sound";
import { useNarrationStore } from "@/stores/useNarrationStore";
export default function PreloadAudio() {

    // attack sound effects
    // const soundEffect = "test";
    // const [playHit] = useSound(`/sounds/${soundEffect ? soundEffect : 'blank'}.m4a`, {
    //         volume: 1,
    //         interrupt:true,
    //         preload:true
    // })

    // narration and voices
    const currentNode = useNarrationStore(state => state.currentNode);
    
    // the voice over
    const [playVoice, voice] = useSound(`/voices/${currentNode ?? 'blank'}.mp3`, {
        interrupt:true,
        preload:true
    })

    // music
      const [playBattleMusic, battleMusic] = useSound(`/music/battle2.mp3`, {
          volume: 0.3,
          interrupt:true,
          preload:true
      })

      return (
        {  
            // sfx: {play: playHit},
            voice: {play: playVoice, stop: voice.stop},
            battleMusic: {play:playBattleMusic, stop: battleMusic.stop}
        }
      )
}