import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function proxy(request: NextRequest) {
  try {

    //getting the cookie
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
