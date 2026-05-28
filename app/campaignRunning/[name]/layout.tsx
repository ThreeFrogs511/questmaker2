
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={` w-full h-dvh max-h-full gap-10! lg:p-10 ${retroGaming.className}`}>
      {children}
    </section>
  );
}
