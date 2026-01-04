'use client'

export default function DataVisualizer({data} : 
{data: {
    type:string | null, 
    status:boolean; 
    value:number | null; 
    target: string | null, 
    success:boolean | null}}) {
    return(
        <>
            <p className={` font-semibold mt-5! ${data.success ? 'text-green-400' : 'text-red-600'}`}>
                {data.status && data.type === 'ability' ? 'YOU ROLL ' + data.value : '' }
                {data.status && data.type === 'penalty' ? 'YOU LOST ' + data.value + ' ' + data.target : '' }
            </p>
        </>
    )
}