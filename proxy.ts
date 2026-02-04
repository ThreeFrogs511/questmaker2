// import { NextResponse } from "next/server";

// export function proxy() {
//     fetch("/api/me")
//       .then((r) => r.json())
//       .then((data) => {
//         if (data.authenticated) {
//           // handling existing but incomplete profile
//           if (!data.user.profile_completed) {
//             updateDraft({ id: data.user.id, email: data.user.email });
//             router.push("/characterCreation");
//           } else {
//             login({ ...data.user });
//             // pathname ==='/characterCreation' && router.push("/journal");
//             console.log(data.user);
//           }
//         }

//         if (data.err) {
//           if (pathname === "/signup") {
//             router.push("/signup");
//           } else if (pathname === "/login") {
//             router.push("/login");
//           } else {
//             router.push("/titleScreen");
//           }
//         };
//       })
//       .catch(() => {
//         router.push("/titleScreen");
//       })
//       .finally(() => {
//         setIsFetchingDone(true);
//       });
// }

// export const config = {
//   matcher: '/',
// }