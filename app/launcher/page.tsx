import { Card, Button } from "pixel-retroui";
import { redirect } from "next/navigation";
import { Launcher } from "@/classes/Launcher";



export default async function LauncherPage() {

  const launcher = new Launcher();
  const { name, description, chapter } = await launcher.returnCampaignData();
  if (!name) return null;

  const pathname = name ? await launcher.formattingCampaignNameForUrl() : null;
  const title =
    chapter === 1 ? "Begin your adventure" : "Resume your adventure";

  async function startCampaign() {
    "use server";
    if (!pathname) return;
    redirect(`/campaignRunning/${pathname}`);
  };

  return (
    <div className=" flex flex-col items-center lg:px-6 lg:py-10 py-3">
      <h1 className="text-center text-2xl! md:text-3xl! tracking-wide mb-10! font-minecraft">
        {title}
      </h1>

      <Card
        bg="black"
        textColor="white"
        borderColor="white"
        shadowColor="transparent"
        className="retro-btn md:p-4! p-2! lg:w-[70%] flex flex-col gap-5 justify-evenly! items-center grow! "
      >
        <div className="flex flex-col items-center">
          <h2 className="text-center text-lg! md:text-xl! lg:text-2xl! mb-3">{`CHAPTER ${chapter}`}</h2>
          <h2 className="w-[90%] text-center text-base! md:text-xl! lg:text-2xl! text-amber-400 mb-5">
            {name?.toUpperCase()}
          </h2>
          <p className="text-center tracking-widest md:text-sm! text-xs!">
            {description}
          </p>
        </div>
        <Button
          bg="black"
          textColor="white"
          borderColor="white"
          shadow="white"
          className=" w-[70%] py-2"
          onPointerDown={async () => {
            "use server";
            await startCampaign();
          }}
        >
          Start →
        </Button>
      </Card>
    </div>
  );
}
