import Header from "@/components/global/Header";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper">
      <Header />
        {children}
    </div>
  );
}
