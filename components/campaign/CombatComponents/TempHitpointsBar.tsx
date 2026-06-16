"use client";
import { useState, useEffect } from "react";
import { ProgressBar } from "pixel-retroui";
import Engine from "@/classes/Engine";
import { useCombatStore } from "@/stores/useCombatStore";

export default function TempHitpointsBar({ gameplay }: { gameplay: Engine }) {

  const tempPlayerData = useCombatStore.getState().tempPlayerData
  const [hpInPercentage, setHpInPercentage] = useState(0);

  useEffect(() => {
    if (!gameplay) return;
    const hp = tempPlayerData.hp ?? 1;
    const damage_taken = tempPlayerData.damage_taken;
    const percentage = ((hp - damage_taken) / hp) * 100;
    setHpInPercentage(percentage < 0 ? 20 : percentage);
  }, [tempPlayerData, tempPlayerData.damage_taken]);

  return (
    <>
      <div className="virtualHpContainer">
        <ProgressBar
          size="sm"
          color="red"
          borderColor="white"
          className="w-full"
          progress={hpInPercentage}
        />
      </div>
    </>
  );
}
