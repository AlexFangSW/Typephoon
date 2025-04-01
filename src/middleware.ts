import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { cookies } from "next/headers";
import { CookieNames } from "./utils/constants";

export async function verifyLogin() {
  // If the user is not logged in, redirect to login page
  const cookieStore = await cookies();
  const username = cookieStore.get(CookieNames.USERNAME);
  if (username == null) {
    return false;
  }
  return true;
}

export async function getUsername() {
  const cookieStore = await cookies();
  const username = cookieStore.get(CookieNames.USERNAME);
  return username?.value ?? "";
}

export async function middleware(request: NextRequest) {
  const loggedIn = await verifyLogin();
  if (!loggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // TODO: revert this to '/profile'
  matcher: ["/profile--"],
};
