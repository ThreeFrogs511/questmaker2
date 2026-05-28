import Header from "@/components/global/Header";
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
        {children}
    </div>
  );
}
