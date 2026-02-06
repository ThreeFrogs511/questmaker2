import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const pathname = request.nextUrl.pathname;
    if (!token) throw new Error();
     switch (pathname) {
      case "/signup":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/login":
        return NextResponse.redirect(new URL("/journal", request.url));
      case "/titleScreen":
        return NextResponse.redirect(new URL("/journal", request.url));
      default:
        return NextResponse.next()
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
