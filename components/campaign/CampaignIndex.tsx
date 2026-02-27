"use client";
import { Card, Button } from "pixel-retroui";

type List = {
  id: number;
  name: string;
  mongo_id: string;
  description: string;
  chapter: number;
};
export default function CampaignIndex({
  campaignList,
  setHasChosenACampaignAction,
  setSelectedCampaignAction,
}: {
  campaignList: List;
  setHasChosenACampaignAction: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCampaignAction: React.Dispatch<
    React.SetStateAction<List | undefined>
  >;
}) {

    
  return (
    <>
      {/* {campaignList.map((c) => (
        <Card
          key={c.id}
          bg="black"
          textColor="white"
          borderColor="white"
          shadowColor="white"
          className="md:p-4! p-2 lg:w-[70%] flex flex-col gap-5 justify-evenly! items-center grow! "
        >
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg! md:text-2xl! text-amber-400">
              {"Chapter " + c.chapter + " : " + c.name.toUpperCase()}
            </h2>
            <p className="text-center tracking-widest md:text-sm! text-xs!">
              {c.description}
            </p>
          </div>
          <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            className="w-[70%] py-2"
            onPointerDown={() => {
              setSelectedCampaignAction(c);
              setHasChosenACampaignAction(true);
            }}
          >
            View
          </Button>
        </Card>
      ))} */}
    </>
  );
}
