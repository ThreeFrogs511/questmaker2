"use client";
import localFont from 'next/font/local'
const retroGaming = localFont({ src: '../public/fonts/retro_gaming.ttf' })

export default function Loading() {
  return (
    <>
      <div className={`w-full h-dvh! right-0! top-0! bg-black fixed! z-999! flex justify-center items-center text-base lg:text-2xl! ${retroGaming.className}`}>
        {/* <div className="loader"></div> */}
        <div className="loader-stage">
          <div className="loader-scene">
            <div className="orbit-ring">
              <div className="particle p1"></div>
              <div className="particle p2"></div>
              <div className="particle p3"></div>
              <div className="particle p4"></div>
              <div className="particle p5"></div>
              <div className="particle p6"></div>
              <div className="particle p7"></div>
              <div className="particle p8"></div>
              <div className="particle p9"></div>
              <div className="particle p10"></div>
            </div>

            <div className="sword">
              <div className="tip-wrap">
                <div className="tip"></div>
                <div className="sparkle sp-top"></div>
                <div className="sparkle sp-bot"></div>
                <div className="sparkle sp-left"></div>
                <div className="sparkle sp-right"></div>
                <div className="sparkle sp-tl"></div>
                <div className="sparkle sp-tr"></div>
                <div className="sparkle sp-bl"></div>
                <div className="sparkle sp-br"></div>
                <div className="sparkle sp-f1"></div>
                <div className="sparkle sp-f2"></div>
                <div className="sparkle sp-f3"></div>
                <div className="sparkle sp-f4"></div>
              </div>
              <div className="blade">
                <div className="blade-fill"></div>
                <div className="fuller"></div>
              </div>
              <div className="crossguard"></div>
              <div className="grip"></div>
              <div className="pommel"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
