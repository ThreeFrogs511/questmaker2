import Music from "@/components/campaign/Audio/Music";


export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" w-full h-dvh max-h-full gap-10! lg:p-10">
      <Music />
      {children}
    </section>
  );
}
