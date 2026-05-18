import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";

interface PayloadType {
  userId: number;
  email: string;
  isCompleted: boolean;
}

export async function proxy(request: NextRequest) {
  try {
    //getting the cookie
    // const token = request.cookies.get("session")?.value;
    const jwt = request.cookies.get("auth")?.value;

    // if no token, redirect to title screen
    if (!jwt) throw new Error("No token");

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: PayloadType } = await jose.jwtVerify(
      jwt,
      secretKey,
    );
    console.log(payload);

    //continuer ici l'implémentation du jwt
    const pathname = request.nextUrl.pathname;

    if (pathname !== "/characterCreation" && payload.isCompleted === false) {
      return NextResponse.redirect(new URL("/characterCreation", request.url));
    };

    switch (pathname) {
      case "/signup":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/login":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/titleScreen":
        return NextResponse.redirect(new URL("/journal", request.url));
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
