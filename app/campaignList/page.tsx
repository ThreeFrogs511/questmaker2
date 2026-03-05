"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "pixel-retroui";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { useUserContext } from "@/context/context";

export default function CampaignList() {
  type List = {
    id: number;
    name: string;
    mongo_id: string;
    description: string;
    chapter: number;
  };

  const [isListFetched, setIsListFetched] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<List>();
  const currentUser = useUserStore((state) => state.currentUser);
  const router = useRouter();

  const {isAuthenticated, isProfileCompleted} = useUserContext();

  if (!isAuthenticated || !isProfileCompleted) {
    return <Loading />;
  }

  //fetching campaign
  useEffect(() => {
    if (!currentUser?.id) return;

    fetch(`api/campaigns/list/${currentUser.id}`)
      .then((r) => r.json())
      .then((data) => setSelectedCampaign(data))
      .then(() => setIsListFetched(true))
      .catch((err) => console.log(err));
  }, [currentUser]);

  return (
    <div className="wrapper">
      <Header />
      {isListFetched ? (
        <div className=" flex flex-col items-center lg:px-6 lg:py-10 py-3">
          <h1 className="text-center text-2xl! md:text-3xl! tracking-wide mb-10! font-minecraft">
            {selectedCampaign?.chapter === 1
              ? "Begin your adventure"
              : "Resume your adventure"}
          </h1>


          <Card
            bg="black"
            textColor="white"
            borderColor="white"
            shadowColor="transparent"
            className="retro-btn md:p-4! p-2! lg:w-[70%] flex flex-col gap-5 justify-evenly! items-center grow! "
          >
            <div className="flex flex-col items-center">
              <h2 className="text-center text-lg! md:text-xl! lg:text-2xl! mb-3">{`CHAPTER ${selectedCampaign?.chapter}`}</h2>
              <h2 className="w-[90%] text-center text-base! md:text-xl! lg:text-2xl! text-amber-400 mb-5">
                {selectedCampaign?.name.toUpperCase()}
              </h2>
              <p className="text-center tracking-widest md:text-sm! text-xs!">
                {selectedCampaign?.description}
              </p>
            </div>
            <Button
              bg="black"
              textColor="white"
              borderColor="white"
              shadow="white"
              className=" w-[70%] py-2"
              onPointerDown={() => {
                router.push(`/campaignRunning/${selectedCampaign?.mongo_id}`);
              }}
            >
              Start →
            </Button>
          </Card>
        </div>
      ) : (
        <Loading />
      )}

      <Footer />
    </div>
  );
}
