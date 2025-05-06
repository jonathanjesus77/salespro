import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Public paths that don't require authentication
  const publicPaths = ["/login"]
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
