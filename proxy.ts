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

    if (pathname !== "/characterCreation" && payload.isCompleted === false) {
      return NextResponse.redirect(new URL("/characterCreation", request.url));
    };

    if (pathname!=="/intro" && payload.tutorialCompleted === false) {
      return NextResponse.redirect(new URL('/intro', request.url));
    }

    if (!payload || !payload.email || !payload.userId) {
      throw new Error("Authentification error")
    }

    switch (pathname) {
      case "/signup":
        console.log("redirection1")
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/login":

        return NextResponse.redirect(new URL("/journal", request.url));
      case "/titleScreen":

        return NextResponse.redirect(new URL("/journal", request.url));
      case "/":

        return NextResponse.redirect(new URL("/journal", request.url))
      default:

        return NextResponse.next();
    }
  } catch {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
