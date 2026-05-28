"use client";
import { useEffect, useState } from "react";
import { Button } from "pixel-retroui";

import PathChosen from "./pathChosen";
import XpGained from "./XpGained";

import { useUserStore } from "@/stores/useUserStore";

import { useRouter } from "next/navigation";
import Engine from "@/classes/Engine";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function EndScreenInterface({ gameplay }: { gameplay: Engine }) {
  const [isSkippingAllowed, setIsSkippingAllowed] = useState(true);
  const [btnText, setBtnText] = useState("Next");
  const [page, setPage] = useState(1);
  const [hasXpBeenUpdated, setHasXpBeenUpdated] = useState(false);

  const currentUser = useUserStore((state) => state.currentUser);

  const router = useRouter();

  useEffect(() => {
    if (page === 2) {
      setBtnText("Quit");
    } else {
      setBtnText("Next");
    }
  }, [page]);

  return (
    <>
      <div className={`fixed h-dvh top-0 bottom-0 left-0 right-0 w-dvw z-999 bg-black flex flex-col justify-center lg:justify-evenly! ${retroGaming.className}`}>
        {page === 1 && <PathChosen gameplay={gameplay} />}
        {page === 2 && (
          <XpGained
            setIsSkippingAllowedAction={setIsSkippingAllowed}
            hasXpBeenUpdated={hasXpBeenUpdated}
            setHasXpBeenUpdatedAction={setHasXpBeenUpdated}
            gameplay={gameplay}
          />
        )}

        <div className="flex flex-row-reverse justify-center gap-5  w-[90%] lg:w-[70%] mx-auto">
          <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            className="lg:w-[50%] p-4 grow text-xl!"
            onPointerDown={async () => {
              if (!isSkippingAllowed) return;
              if (page === 2) {
                const r = await gameplay.savingUserData(currentUser);
                r?.success && router.push("/journal");
              } else {
                setPage((prev) => prev + 1);
              }
            }}
          >
            {btnText}
          </Button>

          <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            className="lg:w-[50%] grow p-4 text-xl!"
            onPointerDown={() => {
              if (!isSkippingAllowed) return;
              setPage((prev) => (prev === 1 ? 1 : prev - 1));
            }}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
}
