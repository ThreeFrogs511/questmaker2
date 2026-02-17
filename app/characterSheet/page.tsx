"use client";
import { Card } from "pixel-retroui";
import Hitpoints from "@/components/userStats/HitpointsBar";
import DopamineBar from "@/components/userStats/DopamineBar";
import Progress from "@/components/userStats/XpBar";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";

import { useUserStore } from "@/stores/useUserStore";

export default function CharacterSheet() {
  
  
  //branchement à mon store
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <>
      <div className="wrapper">
        <Header />

        <section
          id="profile"
          className="
                        w-full
                        sm:w-4/5!
                        md:w-3/4!
                        mx-auto
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-4"
        >
          <div className="flex flex-col mb-3!">
            {/* main stats */}

            
            <Card
              bg="black"
              textColor="white"
              borderColor="white"
              shadowColor="white"
              className="text-center mb-10! lg:mb-2!"
            >
              <div className="p-2 ">
                <ul className="ml-1! flex flex-col justify-evenly items-start">
                  <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                    <div>Username:</div>
                    <div className="text-amber-300">
                      {currentUser?.username}
                    </div>
                  </li>
                  <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                    <div>Level:</div>
                    <div className="text-amber-300">{currentUser?.lvl}</div>
                  </li>
                  <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                    <div>Class:</div>
                    <div className="text-amber-300">
                      {currentUser?.user_class}
                    </div>
                  </li>
                  <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                    <div>Race:</div>
                    <div className="text-amber-300">{currentUser?.race}</div>
                  </li>

                  <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                    <div>Coins:</div>
                    <div className="text-amber-300">{currentUser?.coins}</div>
                  </li>
                </ul>
              </div>
            </Card>

            {/* hp, mana/stamina, xp */}
            <Card
              bg="black"
              textColor="white"
              borderColor="white"
              shadowColor="white"
              className="p-2! text-center grow flex flex-col justify-evenly  "
            >
              <div className="mb-5! mt-2! progressBarContainer ">
                <span className="text-base!  md:text-lg!">Hp</span>
                <div className="w-[95%] mx-auto my-3">
                  <Hitpoints />
                </div>
              </div>

              <div className="mb-5! progressBarContainer ">
                <span className="text-base!  md:text-lg!">Dopamine</span>
                <div className="w-[95%] mx-auto my-3">
                  <DopamineBar />
                </div>
              </div>

              <div className="mb-5!">
                <span className="text-base!  md:text-lg!">Xp</span>
                <div className="w-[95%] mx-auto my-3">
                  <Progress />
                </div>
              </div>
            </Card>
          </div>

          {/* points and attributes */}
          <Card
            bg="black"
            textColor="white"
            borderColor="white"
            shadowColor="white"
            className="text-center flex flex-col justify-evenly mb-5!"
          >
            <p className="mb-3! text-lg! sm:text-lg! md:text-2xl! pt-2 ">
              User stats
            </p>

            <ul className="flex flex-col justify-evenly h-[80%] max-h-full">
              <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                <span>Strength</span>
                <span className="text-yellow-400">
                  {currentUser?.str ?? ""}
                </span>
              </li>
              <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                <span>Dexterity</span>
                <span className="text-yellow-400">
                  {currentUser?.dex ?? ""}
                </span>
              </li>
              <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                <span>Constitution</span>
                <span className="text-yellow-400">
                  {currentUser?.con ?? ""}
                </span>
              </li>
              <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                <span>Intelligence</span>
                <span className="text-yellow-400">
                  {currentUser?.int ?? ""}
                </span>
              </li>
              <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                <span>Wisdom</span>
                <span className="text-yellow-400">
                  {currentUser?.wis ?? ""}
                </span>
              </li>
              <li className=" w-[80%] mx-auto mb-5 py-2 flex justify-between text-base!  md:text-lg!">
                <span>Charisma</span>
                <span className="text-yellow-400">
                  {currentUser?.cha ?? ""}
                </span>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </>
  );
}
