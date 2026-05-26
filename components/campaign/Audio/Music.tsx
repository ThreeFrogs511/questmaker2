"use client";
import { useEffect } from "react";
import useSound from "use-sound";
import { useNarrationStore } from "@/stores/useNarrationStore";

export default function Music() {
  let ost = useNarrationStore((state) => state.ost);
  const [play, { stop }] = useSound("/music/ost2.mp3", {
    volume: 0.4,
    interrupt: true,
    html5: true,
    preload: true,
    onend: () => console.log("musique terminé!"),
  });

  ost = () => {
    play();
  };

  // Playing the voice
  useEffect(() => {
    ost();
    return () => stop();
  }, [play, stop]);

  return null;
}
