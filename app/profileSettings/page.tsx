import { Card } from "pixel-retroui";
import ProfileSettingsInputs from "@/components/profileSettings/ProfileSettingsInputs";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function ProfileSettings() {
  return (
    <>
      <Card
        bg="#000000"
        textColor="#ffffff"
        borderColor="#ffffff"
        className={`lg:w-[70%]! w-[90%]! h-[90%] bg-black flex flex-col justify-around gap-5 p-3 ${retroGaming.className}`}
      >
        <h1 className=" text-xl! font-bold mt-2! mb-3 lg:mb-5! text-center">
          Profile
        </h1>
        <ProfileSettingsInputs />
      </Card>
    </>
  );
}
