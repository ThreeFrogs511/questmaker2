import { Card, Button } from "pixel-retroui";
import { redirect } from "next/navigation";
import { Launcher } from "@/classes/Launcher";
import Form from 'next/form';
import ResetStates from "@/components/campaign/Global/ResetStates";
import localFont from 'next/font/local'


const retroGaming = localFont({
  src: '../../public/fonts/retro_gaming.ttf',
})

export default async function LauncherPage() {

  const launcher = new Launcher();
  const { name, description, chapter } = await launcher.returnCampaignData();
  if (!name) return null;

  const pathname = name ? await launcher.formattingCampaignNameForUrl() : null;
  const title =
    chapter === 1 ? "Begin your adventure" : "Resume your adventure";

    

  return (
    <div className={`flex flex-col items-center lg:px-6 lg:py-10 py-3 ${retroGaming.className}`}>

      {/* crucial for resetting campaign related states and avoiding cache issues */}
      <ResetStates />
      <h1 className="text-center text-2xl! md:text-3xl! tracking-wide mb-10!">
        {title}
      </h1>

      <Card
        bg="black"
        textColor="white"
        borderColor="white"
        shadowColor="transparent"
        className={`${retroGaming.className} retro-btn md:p-4! p-2! lg:w-[70%] flex flex-col gap-5 justify-evenly! items-center grow!`}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-center text-lg! md:text-xl! lg:text-2xl! mb-3">{`CHAPTER ${chapter}`}</h2>
          <h2 className="w-[90%] text-center text-base! md:text-xl! lg:text-2xl! text-amber-400 mb-5">
            {name?.toUpperCase()}
          </h2>
          <p className="text-center tracking-widest md:text-lg! text-xs!">
            {description}
          </p>
        </div>
        <Form action={`/campaignRunning/${pathname}`} className="w-full flex justify-center">
          <Button
            bg="black"
            type="submit"
            textColor="white"
            borderColor="white"
            shadow="white"
            className={`w-[70%] py-2 ${retroGaming.className}`}
          >
            Start →
          </Button>
        </Form>
      </Card>
    </div>
  );
}
