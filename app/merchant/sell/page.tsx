import MerchantSell from "@/components/Merchant/MerchantSell";
import MerchantToolbar from "@/components/Merchant/MerchantToolBar";

import localFont from "next/font/local";
const retroGaming = localFont({ src: "../../../public/fonts/retro_gaming.ttf" });

export default function MerchantSellPage() {

  return (
    <section id="section-merchant-sell" className={` lg:w-[80%]! lg:mx-auto h-full! flex flex-col w-full overflow-hidden grow ${retroGaming.className}`}>
      <MerchantToolbar />
      <MerchantSell />
    </section>
  );
}
