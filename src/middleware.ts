import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { cookies } from "next/headers";
import { ACCESS_TOKEN } from './utils/constants';

export async function verifyLogin() {
  // If the user is not logged in, redirect to login page
  const cookieStore = await cookies()
  const access_token = cookieStore.get(ACCESS_TOKEN)
  if (access_token == null) {
    return false
  }
  return true
}

export async function middleware(request: NextRequest) {
  const loggedIn = await verifyLogin()
  if (!loggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/profile'],
}
