"use client";
import { Card } from "pixel-retroui";

export default function SkeletonQuest() {
  return (
    <Card
      bg="black"
      borderColor="white"
      shadowColor="transparent"
      textColor="white"
      className="flex justify-between items-center md:py-5! px-2! mb-3! md:mx-5!"
    >
      <div className="flex items-center gap-3 w-full">
        {/* Fake checkbox */}
        <div className="min-w-5 h-5 mr-5 bg-gray-700 animate-pulse" />
        {/* Fake text lines */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
        </div>
      </div>
      {/* Fake delete icon */}
      <div className="min-w-5 h-5 ml-5 bg-gray-700 rounded animate-pulse" />
    </Card>
  );
}
