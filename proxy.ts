import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { PayloadType } from "./types/types";

export async function proxy(request: NextRequest) {
  try {
    //getting the cookie
    const jwt = request.cookies.get("auth")?.value;

    // if no token, redirect to title screen
    if (!jwt) throw new Error("No token");

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );


    const pathname = request.nextUrl.pathname;
    const authorizedPathnameTutorialIncomplete = [
      "/intro",
      "/campaignRunning/a_terrible_hangover",
      "/titleScreen",
    ];

    if (!payload || !payload.email || !payload.userId) {
      throw new Error("Authentification error");
    }

    if (pathname !== "/characterCreation" && payload.isCompleted === false) {
      console.log("redirection char creation");
      return NextResponse.redirect(new URL("/characterCreation", request.url));
    }


    if (
      payload.isCompleted === true &&
      payload.tutorialCompleted === false &&
      !authorizedPathnameTutorialIncomplete.includes(pathname)
    ) {
      console.log("redirection tutorial");
      return NextResponse.redirect(new URL("/intro", request.url));
    }

      switch (pathname) {
        case "/signup":
          return NextResponse.redirect(new URL("/journal", request.url));
        case "/login":
          return NextResponse.redirect(new URL("/journal", request.url));
        case "/titleScreen":
          return NextResponse.redirect(new URL("/journal", request.url));
        case "/":
          return NextResponse.redirect(new URL("/journal", request.url));
        case "/characterCreation":
          return NextResponse.redirect(new URL("/journal", request.url));
        case "/intro":
          return NextResponse.redirect(new URL("/journal", request.url));

        default:
          return NextResponse.next();
      }
    

  } catch (err) {
    console.log((err as Error).message)
    const pathname = request.nextUrl.pathname;
    switch (pathname) {
      case "/signup":
        return NextResponse.next();
      case "/login":
        return NextResponse.next();
      case "/titleScreen":
        return NextResponse.next();
      default:
        return NextResponse.redirect(new URL("/titleScreen", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.json|.*\\.mp3|.*\\.wav|.*\\.m4a|.*\\.svg).*)"],

};
