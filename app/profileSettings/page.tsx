import { Card } from "pixel-retroui";
import ProfileSettingsInputs from "@/components/profileSettings/ProfileSettingsInputs";

export default function ProfileSettings() {
  return (
    <>
      <Card
        bg="#000000"
        textColor="#ffffff"
        borderColor="#ffffff"
        className="lg:w-[70%]! w-[90%]! h-[90%] bg-black flex flex-col justify-around gap-5 p-3"
      >
        <h1 className=" text-xl! font-bold mt-2! mb-3 lg:mb-5! text-center font-minecraft">
          Profile
        </h1>
        <ProfileSettingsInputs />
      </Card>
    </>
  );
}
