import { cookies } from "next/headers"
import Image from 'next/image'
import Link from "next/link"

export default async function Navbar() {
  const cookieStore = await cookies()
  console.log("cookieStore: ", cookieStore.getAll())
  const isLoggedIn = false

  return (
    <>
      <div className="flex flex-row justify-between justify-center items-center text-[1.5rem]">
        {/* icon */}
        <Link href={"/"} className="flex flex-row justify-center items-center gap-x-1">
          <Image
            src="/typephoonIcon.png"
            alt="Icon"
            width={35}
            height={35}
          />
          <p className="text-[2rem]">Typephoon</p>
        </Link>

        {/* game modes */}
        <div className="">
          <Link href={"/"}>
            Solo
          </Link>
          <Link href={"/"}>
            Random
          </Link>
          <Link href={"/"}>
            Team
          </Link>
        </div>

        {/* user profile */}
        <div>
          <Link href={"/"}>
            {isLoggedIn ? "Profile" : "Login"}
          </Link>
        </div>
      </div>
    </>
  )
}

