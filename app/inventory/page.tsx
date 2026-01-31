'use client'
import Header from "@/components/global/Header"
import Footer from "@/components/global/Footer"
import { useUserStore } from "@/stores/useUserStore"
import { useEffect, useState } from "react"

export default function Inventory() {

    const currentUser = useUserStore(state => state.currentUser);
    const [currentInventory, setCurrentInventory] = useState<any>()
    const [inventoryRendered, setInventoryRendered] = useState(false);

    useEffect(() => {
        if (!currentUser.id) return;

        fetch(`/api/inventory/${currentUser.id}`)
        .then(r => r.json())
        .then(data => {
            if (data.length<=0) {
                const array = [];
                for (let i = 0; i<30; i++) {
                    array.push({name:""})
                }
                setCurrentInventory([...array])
              
            } else {
                setCurrentInventory([...data])
            }
        })
        .then(() => setInventoryRendered(true))

    }, [currentUser.id])


       return(
        <>
        <div className="wrapper">
            <Header />
                <section className=" flex flex-col justify-center items-center">
                    <div className="mb-5">
                        <h2 className="text-2xl font-minecraft leading-relaxed">Inventory</h2>
                    </div>
                    <div className="h-[90%] w-[50%]  overflow-hidden rounded-lg! p-5">

                        <div id="itemsList" className="flex flex-wrap gap-1 justify-center">
                            {inventoryRendered && currentInventory.map((item:any, key:string) => (
                                <figure 
                                key={key} 
                                className="w-20! min-w-20! hover:border-3! text-center border-2! cursor-pointer! min-h-full! max-h-full! aspect-square overflow-hidden rounded-lg"
                                >
                                    {item.name}
                                </figure>
                            ))}
                        </div>

                    </div>
                </section>
            <Footer />
        </div>
        </>
    )
}