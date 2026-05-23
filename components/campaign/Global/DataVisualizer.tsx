// "use client";

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
        className={` font-semibold mt-5! ${choiceResult.success ? "text-green-400" : "text-red-600"}`}
      >
        {choiceResult.status && choiceResult.type === "ability" ? "YOU ROLL " + choiceResult.value : ""}
        {choiceResult.status && choiceResult.type === "penalty"
          ? "YOU LOST " + choiceResult.value + " " + choiceResult.target
          : ""}
      </p>
    </>
  );
}
