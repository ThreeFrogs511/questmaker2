import fetchCampaign from "@/lib/fetchCampaign";
import { Card, Button } from "pixel-retroui";
import { redirect } from "next/navigation";

type campaignType = {
  id?: number;
  name?: string;
  description?: string;
  mongo_id?: string;
  chapter?: number;
  err?: string;
};


export default async function CampaignList() {
  
  const campaign: campaignType = await fetchCampaign();
  const title =
    campaign?.chapter === 1 ? "Begin your adventure" : "Resume your adventure";
  const name = campaign?.name ?? "";
  const description = campaign?.description ?? "";
  const chapter = campaign?.chapter ?? "";
  const quest_id = campaign?.mongo_id ?? null;

  async function debutingCampaign() {
    "use server";
    if (!quest_id) return;
    redirect(`/campaignRunning/${quest_id}`);
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
            {name.toUpperCase()}
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
            await debutingCampaign();
          }}
        >
          Start →
        </Button>
      </Card>
    </div>
  );
}
