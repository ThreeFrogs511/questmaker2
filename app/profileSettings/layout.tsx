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
        <section className="w-full max-h-full flex flex-col justify-center items-center">
        {children}
      </section>
    </div>
  );
}
