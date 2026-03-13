import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware to avoid MIDDLEWARE_INVOCATION_FAILED error
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Restrict matcher to avoid unnecessary middleware calls
export const config = {
  matcher: [
    // Only match specific paths to minimize middleware overhead
    '/dashboard/:path*',
    '/api/:path*',
  ],
};