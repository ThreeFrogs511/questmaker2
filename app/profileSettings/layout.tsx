import Header from "@/components/global/Header";
import MerchantHeader from "@/components/Merchant/MerchantHeader";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`wrapper ${retroGaming.className}`}>
      <Header />
        <section className="w-full max-h-full flex flex-col justify-center items-center">
        {children}
      </section>
    </div>
  );
}
