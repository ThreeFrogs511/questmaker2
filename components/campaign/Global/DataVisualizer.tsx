// "use client";
import PixelTick from "./PixelTick";
import CrossTick from "./CrossTick";
import PenaltyArrow from "./PenaltyArrow";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function DataVisualizer({
  choiceResult,
}: {
  choiceResult: {
    type: string | null;
    status: boolean;
    value: number | null;
    target: string | null;
    success: boolean | null;
  };
}) {
  if (!choiceResult.type) {
    return null;
  }


  return (
    <>
      <p
        className={` mt-5! max-w-fit p-1 rounded flex items-center gap-2 ${retroGaming.className}
          ${choiceResult.success ? " text-green-400" : " text-red-600"}`}
      >
        {choiceResult.status && choiceResult.type === "ability"
          ? "YOU ROLL " + choiceResult.value
          : ""}
        {choiceResult.status &&
          choiceResult.type === "ability" &&
          choiceResult.success && <PixelTick />}
        {choiceResult.status &&
          choiceResult.type === "ability" &&
          !choiceResult.success && <CrossTick />}

        {choiceResult.status && choiceResult.type === "penalty"
          ? "YOU LOST " + choiceResult.value + " " + choiceResult.target
          : ""}
        {choiceResult.status && choiceResult.type === "penalty" && (
          <PenaltyArrow />
        )}
      </p>
    </>
  );
}
