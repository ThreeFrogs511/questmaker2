"use client";
import { Card } from "pixel-retroui";
import Hitpoints from "@/components/userStats/HitpointsBar";
import DopamineBar from "@/components/userStats/DopamineBar";
import Progress from "@/components/userStats/XpBar";
import Header from "@/components/global/Header";
import { useCharacterStore } from "@/stores/useCharacterStore";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function CharacterSheetClient() {
  const character = useCharacterStore((state) => state.character);


  return (
    <>
      <div className={`h-full grid grid-rows-[auto_1fr] ${retroGaming.className}`}>
        <Header />

        <section id="profile" className="w-full h-full flex py-5">
          <div
            className="sm:w-4/5!
                        md:w-3/4!
                        w-full!
                        mx-auto
                        h-full
                        grid
                        grid-cols-1
                        xl:grid-cols-2
                        gap-4
                        "
          >
            <div className="flex flex-col gap-4! xl:gap-0! h-full! ">
              <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="text-center "
              >
                <div className="p-2 lg:p-0!">
                  <ul className="ml-1! flex flex-col justify-evenly items-start">
                    <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                      <div>Username:</div>
                      <div className="text-amber-300">
                        {character?.username ?? "Loading"}
                      </div>
                    </li>
                    <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                      <div>Level:</div>
                      <div className="text-amber-300">{character?.lvl}</div>
                    </li>
                    <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                      <div>Class:</div>
                      <div className="text-amber-300">
                        {character?.user_class}
                      </div>
                    </li>
                    <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                      <div>Race:</div>
                      <div className="text-amber-300">{character?.race}</div>
                    </li>
                    <li className="text-base! w-full md:text-lg! grid grid-cols-2">
                      <div>Coins:</div>
                      <div className="text-amber-300">{character?.coins}</div>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card
                bg="black"
                textColor="white"
                borderColor="white"
                shadowColor="white"
                className="p-2! lg:p-0! text-center flex flex-col justify-evenly grow "
              >
                <div className="mb-5! mt-2! progressBarContainer ">
                  <span className="text-base!  md:text-lg!">Hp</span>
                  <div className="w-[95%] mx-auto mb-3">
                    <Hitpoints />
                  </div>
                </div>

                <div className="mb-5! progressBarContainer ">
                  <span className="text-base!  md:text-lg!">Dopamine</span>
                  <div className="w-[95%] mx-auto mb-3">
                    <DopamineBar />
                  </div>
                </div>

                <div className="mb-5!">
                  <span className="text-base!  md:text-lg!">Xp</span>
                  <div className="w-[95%] mx-auto mb-3">
                    <Progress />
                  </div>
                </div>
              </Card>
            </div>

            <Card
              bg="black"
              textColor="white"
              borderColor="white"
              shadowColor="white"
              className="text-center flex flex-col justify-evenly"
            >
              <p className="mb-3! text-lg! sm:text-lg! md:text-2xl! pt-2 ">
                User stats
              </p>

              <ul className="flex flex-col justify-evenly h-[80%] max-h-full">
                <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Strength</span>
                  <span
                    className={
                      character?.str && character.str >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.str ?? ""}
                  </span>
                </li>
                <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Dexterity</span>
                  <span
                    className={
                      character?.dex && character.dex >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.dex ?? ""}
                  </span>
                </li>
                <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Constitution</span>
                  <span
                    className={
                      character?.con && character.con >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.con ?? ""}
                  </span>
                </li>
                <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Wisdom</span>
                  <span
                    className={
                      character?.wis && character.wis >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.wis ?? ""}
                  </span>
                </li>
                <li className=" w-[80%] mx-auto py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Intelligence</span>
                  <span
                    className={
                      character?.int && character.int >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.int ?? ""}
                  </span>
                </li>
                <li className=" w-[80%] mx-auto mb-5 py-2 flex justify-between text-base!  md:text-lg!">
                  <span>Charisma</span>
                  <span
                    className={
                      character?.cha && character.cha >= 10
                        ? "text-yellow-400"
                        : "text-red-600"
                    }
                  >
                    {character?.cha ?? ""}
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
