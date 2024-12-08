import { redirect } from "next/navigation"

export async function redirectToLogin() {
  'use server'
  redirect("/api/v1/auth/login")
}

