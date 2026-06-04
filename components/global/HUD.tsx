// "use client";

// import { Press_Start_2P } from "next/font/google";

// const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

// const NAV_ITEMS = [
//   { id: "map",       icon: "⊞", label: "MAP"    },
//   { id: "inventory", icon: "⊠", label: "BAG"    },
//   { id: "spells",    icon: "✦", label: "SPELLS" },
//   { id: "character", icon: "◈", label: "CHAR"   },
//   { id: "journal",   icon: "⊟", label: "LOG"    },
//   { id: "settings",  icon: "⊙", label: "OPT"    },
// ] as const;

// type NavId = (typeof NAV_ITEMS)[number]["id"];

// interface StatBar {
//   label: string;
//   labelColor: string;
//   fillColor: string;
//   current: number;
//   max: number;
// }

// const BARS: StatBar[] = [
//   { label: "HP", labelColor: "#cc3333", fillColor: "#7a1a1a", current: 72,  max: 100  },
//   { label: "MP", labelColor: "#3b7dd8", fillColor: "#152a5a", current: 45,  max: 100  },
//   { label: "XP", labelColor: "#fbbf24", fillColor: "#7a5a00", current: 880, max: 1000 },
// ];

// const READOUT = [
//   { label: "GOLD", value: "1,240" },
//   { label: "ARM",  value: "14"    },
//   { label: "ATK",  value: "+4"    },
// ];

// interface GameHUDProps {
//   characterName?: string;
//   characterClass?: string;
//   level?: number;
//   activeNav?: NavId;
// }

// export default function GameHUD({
//   characterName = "ALDRIC",
//   characterClass = "PALADIN",
//   level = 7,
//   activeNav = "map",
// }: GameHUDProps) {
//   const lvl = String(level).padStart(2, "0");

//   return (
//     <div className="fixed bottom-0 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-full sm:w-[min(900px,calc(100vw-32px))]">
//       <nav
//         className={`${pixelFont.className} bg-black border-t-2 border-t-yellow-400 sm:border sm:border-[#2a1e08] sm:border-t-2 sm:border-t-yellow-400`}
//       >

//         {/* ── DESKTOP ── */}
//         <div className="hidden sm:flex items-center gap-4 px-5 py-3.5">

//           {/* Identity */}
//           <div className="flex flex-col gap-1.5 shrink-0 w-24">
//             <span className="text-[13px] text-yellow-400">{characterName}</span>
//             <span className="text-[10px] text-yellow-900">// {characterClass}</span>
//             <span className="text-[10px] text-yellow-400 border border-yellow-900 px-1.5 py-0.5 w-fit">
//               LV.{lvl}
//             </span>
//           </div>

//           <div className="w-px self-stretch bg-[#2a1e08] shrink-0" />

//           {/* Bars */}
//           <div className="flex flex-col gap-2.5 flex-1 min-w-0">
//             {BARS.map((bar) => (
//               <div key={bar.label} className="flex items-center gap-2.5">
//                 <span className="text-[10px] w-6 shrink-0" style={{ color: bar.labelColor }}>
//                   {bar.label}
//                 </span>
//                 <div className="flex-1 h-2.5 bg-[#0a0800] border border-[#1a1200] min-w-0">
//                   <div
//                     className="h-full"
//                     style={{ width: `${(bar.current / bar.max) * 100}%`, background: bar.fillColor }}
//                   />
//                 </div>
//                 <span className="text-[10px] w-[72px] text-right shrink-0" style={{ color: bar.fillColor }}>
//                   {bar.current}/{bar.max}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="w-px self-stretch bg-[#2a1e08] shrink-0" />

//           {/* Readout */}
//           <div className="flex flex-col gap-2 shrink-0 w-24">
//             {READOUT.map((r) => (
//               <div key={r.label} className="text-[10px] text-yellow-900">
//                 {r.label} <span className="text-yellow-400">{r.value}</span>
//               </div>
//             ))}
//           </div>

//           <div className="w-px self-stretch bg-[#2a1e08] shrink-0" />

//           {/* Nav */}
//           <div className="flex gap-1.5 shrink-0">
//             {NAV_ITEMS.map((item) => {
//               const active = item.id === activeNav;
//               return (
//                 <button
//                   key={item.id}
//                   aria-label={item.label}
//                   className={`w-10 h-10 text-lg bg-black border flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-100 ${
//                     active
//                       ? "border-yellow-400 text-yellow-400"
//                       : "border-[#2a1e08] text-[#3a2c00] hover:border-yellow-900 hover:text-yellow-900"
//                   }`}
//                 >
//                   {item.icon}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── MOBILE ── */}
//         <div className="flex flex-col sm:hidden">

//           {/* Row 1: identity + readout */}
//           <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1200]">
//             <div className="flex flex-col gap-1 shrink-0">
//               <span className="text-[11px] text-yellow-400">{characterName}</span>
//               <span className="text-[8px] text-yellow-900">// {characterClass}</span>
//             </div>
//             <span className="text-[9px] text-yellow-400 border border-yellow-900 px-1.5 py-0.5 shrink-0">
//               LV.{lvl}
//             </span>
//             <div className="w-px self-stretch bg-[#2a1e08] mx-1 shrink-0" />
//             <div className="flex gap-4 flex-1 justify-end">
//               {READOUT.map((r) => (
//                 <div key={r.label} className="flex flex-col items-center gap-0.5">
//                   <span className="text-[10px] text-yellow-400">{r.value}</span>
//                   <span className="text-[7px] text-yellow-900">{r.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Row 2: bars */}
//           <div className="flex flex-col gap-2 px-4 py-2.5 border-b border-[#1a1200]">
//             {BARS.map((bar) => (
//               <div key={bar.label} className="flex items-center gap-2.5">
//                 <span className="text-[9px] w-6 shrink-0" style={{ color: bar.labelColor }}>
//                   {bar.label}
//                 </span>
//                 <div className="flex-1 h-2 bg-[#0a0800] border border-[#1a1200] min-w-0">
//                   <div
//                     className="h-full"
//                     style={{ width: `${(bar.current / bar.max) * 100}%`, background: bar.fillColor }}
//                   />
//                 </div>
//                 <span className="text-[9px] w-14 text-right shrink-0" style={{ color: bar.fillColor }}>
//                   {bar.current}/{bar.max}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Row 3: nav */}
//           <div className="flex gap-1.5 px-4 py-2.5">
//             {NAV_ITEMS.map((item) => {
//               const active = item.id === activeNav;
//               return (
//                 <button
//                   key={item.id}
//                   aria-label={item.label}
//                   className={`flex-1 h-9 text-base bg-black border flex items-center justify-center cursor-pointer transition-colors duration-100 ${
//                     active
//                       ? "border-yellow-400 text-yellow-400"
//                       : "border-[#2a1e08] text-[#3a2c00] hover:border-yellow-900 hover:text-yellow-900"
//                   }`}
//                 >
//                   {item.icon}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//       </nav>
//     </div>
//   );
// }