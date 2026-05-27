// "use client";
import PixelTick from "./PixelTick";
import CrossTick from "./CrossTick";
import PenaltyArrow from "./PenaltyArrow";

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
  return (
    <>
      <p
        className={` font-minecraft mt-5! flex items-center gap-2 ${choiceResult.success ? "text-green-400" : "text-red-600"}`}
      >
        {choiceResult.status && choiceResult.type === "ability" ? "YOU ROLL " + choiceResult.value : ""}
        {choiceResult.status && choiceResult.type === "ability" && choiceResult.success && <PixelTick />}
        {choiceResult.status && choiceResult.type === "ability" && !choiceResult.success && <CrossTick />}

        {choiceResult.status && choiceResult.type === "penalty"
          ? "YOU LOST " + choiceResult.value + " " + choiceResult.target
          : ""}
        {choiceResult.status && choiceResult.type === "penalty" && <PenaltyArrow />}
      </p>
    </>
  );
}
