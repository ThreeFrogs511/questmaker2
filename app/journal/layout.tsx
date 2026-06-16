import Header from "@/components/global/Header";
// import GameHUD from "@/components/global/HUD";
export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper">
      <Header />
      <section id="todo-list" className="h-full overflow-hidden flex flex-col">
   
        {children}
        {/* <GameHUD /> */}
      </section>
    </div>
  );
}
