import { redirect } from "next/navigation";
import Image from "next/image";


export default function Merchant() {
  
  const vendorChoices = ["Purchase", "Sell"];
  const icons = ["/icons/items/buy.svg", "/icons/items/sell.svg"];



  return (
    <>

          <div className="h-[70%] lg:h-full! w-full! lg:w-[70%]! flex flex-col md:flex-row items-center gap-2">
            {vendorChoices.map((item: string, index: number) => (
              <div
                key={index}
                onPointerDown={async () => {
                  "use server";
                  if (item === "Purchase") {
                    redirect("/merchant/purchase");
                  } else {
                    redirect("/merchant/sell");
                  }
                }}
                className="w-[90%] md:w-[50%] h-full cursor-pointer hover:border-amber-300! border border-white! rounded-lg flex flex-col justify-center items-center gap-5"
              >
                <div className="w-[50%] md:w-[80%] ">
                  <Image
                    src={icons[index]}
                    width={200}
                    height={200}
                    // fill={true}
                    className="shrink-0 mx-auto"
                    alt="vendor action"
                    loading="eager"
                    preload={true}
                  />
                </div>
                <p className={`font-minecraft text-sm! md:text-xl text-white`}>
                  {item}
                </p>
              </div>
            ))}
          </div>
    </>
  );
}
