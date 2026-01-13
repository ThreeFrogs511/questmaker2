'use client'

export default function PressPlayIcon({isPressed, setIsPressedAction}: {
    isPressed:boolean,
    setIsPressedAction:React.Dispatch<React.SetStateAction<boolean>>,

}) {


    return(
        <>
        <figure className="max-h-full h-[50%] lg:h-[70%] mt-1! ml-10! lg:border-0 border-2! lg:p-0 p-1 border-white rounded cursor-pointer" onClick={() => setIsPressedAction(prev => !prev)}>
        {  isPressed  ? 
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className=" h-full" > 
            <path d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z" fill="currentColor"/> 
            </svg>
            :
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className=" h-full"> 
            <path d="M10 4H5v16h5V4zm9 0h-5v16h5V4z" fill="currentColor"/> 
            </svg>
        }
        </figure>
        </>
    )

}