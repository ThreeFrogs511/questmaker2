"use client";
import Header from "@/components/global/Header";
import { useState, useEffect, useRef } from "react";
import { merchantGreetings } from "@/assets/merchantGreetings";
import MerchantBuy from "@/components/vendor/MerchantBuy";
import MerchantMenu from "@/components/vendor/MerchantMenu";
import MerchantSell from "@/components/vendor/MerchantSell";
import VendorToolbar from "@/components/vendor/VendorToolbar";
import Loading from "@/app/loading"
import { useUserContext } from "@/context/context";


export default function VendorClient() {

  const title = "Guilbert's Store";
  const [isTyping, setIsTyping] = useState(true);
  const counter = useRef(-1);
  const [greetings, setGreetings] = useState("");
  const [choosePurchase, setChoosePurchase] = useState(false);
  const [chooseSell, setChooseSell] = useState(false);
  const [notEnoughMoney, setNotEnoughMoney] = useState(false);

  const {isAuthenticated, isProfileCompleted} = useUserContext();

  useEffect(() => {
    const selectedGreetings =
      merchantGreetings[Math.floor(Math.random() * merchantGreetings.length)];
    const intervalId = setInterval(() => {
      if (isTyping) {
        if (!isTyping) return;
        setIsTyping((prev) => !prev);
        const letter = selectedGreetings.charAt(counter.current);
        setGreetings((prev) => prev + letter);
        counter.current++;
        setIsTyping((prev) => !prev);
        if (counter.current === selectedGreetings.length)
          clearInterval(intervalId);
      }
    }, 30);
    return () => clearInterval(intervalId);
  }, [isTyping]);

  if (!isAuthenticated || !isProfileCompleted) {
    return <Loading />;
  }

  return (
    <>
      <div className="wrapper">
        <Header />
        <section className=" w-full  h-full! max-h-full overflow-hidden flex flex-col mx-auto gap-5 items-center lg:pb-5">
          <div className="mb-5 flex flex-col items-center">
            <h2 className="text-xl! lg:text-2xl! font-minecraft leading-relaxed text-amber-300">
              {title}
            </h2>
            <h3 className="font-minecraft text-xs! lg:text-sm! text-center min-h-5">
              {greetings}
            </h3>
          </div>
          {(choosePurchase || chooseSell) && <VendorToolbar setChooseAction={choosePurchase ? setChoosePurchase : setChooseSell} notEnoughMoney={notEnoughMoney} setNotEnoughMoneyAction={setNotEnoughMoney}/>}
          {(!choosePurchase && !chooseSell) && <MerchantMenu setChoosePurchaseAction={setChoosePurchase} setChooseSellAction={setChooseSell}/>}
          {(choosePurchase && !chooseSell) && <MerchantBuy setNotEnoughMoneyAction={setNotEnoughMoney}/>}
          {(!choosePurchase && chooseSell) && <MerchantSell setChooseSellAction={setChooseSell}/>}
        </section>
      </div>
    </>
  );
}
