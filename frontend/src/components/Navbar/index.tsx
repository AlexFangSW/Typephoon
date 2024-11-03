import { cookies } from "next/headers"
import Image from 'next/image'
import Link from "next/link"
import styles from "./Navbar.module.scss"
import GameModes from "./gameModes"


export default async function Navbar() {
  const cookieStore = await cookies()
  console.log("cookieStore: ", cookieStore.getAll())
  const isLoggedIn = false

  return (
    <>
      <div className={styles.container}>
        {/* icon */}
        <Link href={"/"} className={styles.icon}>
          <Image
            src="/typephoonIcon.png"
            alt="Icon"
            width={35}
            height={35}
          />
          <div>TYPEPHOON</div>
        </Link>

        {/* game modes */}
        <GameModes />

        {/* user profile */}
        <div className={styles.profile}>
          <Link href={"/login"}>
            {isLoggedIn ? "Profile" :
              <Image
                src="/profile.svg"
                alt="Profile"
                width={35}
                height={35}
              />
            }
          </Link>
        </div>
      </div>
    </>
  )
}

