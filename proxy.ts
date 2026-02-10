import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { generateCsrfToken } from "./middlewares/csrf";
import { checkIfUserAuth } from "./middlewares/session";

export async function proxy(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    const pathname = request.nextUrl.pathname;
    if (!token) throw new Error();
    switch (pathname) {
      case "/signup":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/login":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/titleScreen":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/profileSettings":
        const res = NextResponse.next();
        res.cookies.set({
          name: "csrf",
          value: crypto.randomUUID(),
          httpOnly: false,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 30,
        });
        return res;
      // await generateCsrfToken(request, res);
      // return res;
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
