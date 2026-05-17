import Header from "@/components/global/Header";
import MerchantHeader from "@/components/Merchant/MerchantHeader";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper">
      <Header />
      <section className=" w-full  h-full! max-h-full overflow-hidden flex flex-col mx-auto gap-5 items-center lg:pb-5">
        <MerchantHeader />
        {children}
      </section>
    </div>
  );
}
