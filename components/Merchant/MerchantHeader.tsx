"use client";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { merchantGreetings } from "@/assets/merchantGreetings";
import Loading from "@/app/loading";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function MerchantHeader() {
  const title = "Guilbert's Store";
  const [isTyping, setIsTyping] = useState(true);
  const counter = useRef(-1);
  const [greetings, setGreetings] = useState("");
   
  
  useEffect(() => {
    const selectedGreetings =
      merchantGreetings[Math.floor(Math.random() * merchantGreetings.length)];
    const intervalId = setInterval(() => {
      if (isTyping) {
        if (!isTyping) return;
        setIsTyping((prev) => !prev);
        const letter = selectedGreetings.charAt(counter.current);
        setGreetings((prev) => prev + letter);
        counter.current++;
        setIsTyping((prev) => !prev);
        if (counter.current === selectedGreetings.length)
          clearInterval(intervalId);
      }
    }, 30);
    return () => clearInterval(intervalId);
  }, [isTyping]);


  return (
    <div id="header-merchant" className={retroGaming.className}>
      <h2 className="text-xl! text-center lg:text-2xl! leading-relaxed text-amber-300">
        {title}
      </h2>
      <h3 className="text-center text-xs! lg:text-sm! min-h-5">
        {greetings}
      </h3>
    </div>
  );
}
