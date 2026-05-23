"use client";
import { useEffect, useState, useRef } from "react";
import { Press_Start_2P } from "next/font/google";

const PressStartFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function TypeWriterTitle() {
  const [title, setTitle] = useState<string | undefined>("");
  const [isTyping, setIsTyping] = useState(true);
  const counter = useRef(-1);

  useEffect(() => {
    const loginTitle: string = "Continue your journey";
    const intervalId = setInterval(() => {
      if (!isTyping) return;
      if (isTyping) {
        setIsTyping((prev) => !prev);
        setTitle((prev) => prev + loginTitle.charAt(counter.current));
        counter.current++;
        setIsTyping((prev) => !prev);
      }
    }, 60);
    return () => clearInterval(intervalId);
  }, [isTyping]);

  return (
    <h2
      className={`
                        mx-auto text-center
                        text-xl!
                        sm:text-2xl!
                        text-stone-300
                        ${PressStartFont.className}`}
    >
      {title}
    </h2>
  );
}
