'use client'
import Link from "next/link"
import styles from "./Navbar.module.scss"
import { usePathname } from "next/navigation"

export default function GameModes() {
  // check the path to see which game mode should be highlighted
  const pathname = usePathname()
  return <div className={styles.game_modes}>
    <Link href={"/"} className={pathname == "/" || pathname == "/result" ? styles.selected : ""}>
      SOLO
    </Link>
    <Link href={"/random/lobby"} className={pathname.startsWith("/random") ? styles.selected : ""}>
      RANDOM
    </Link>
    <Link href={"/team"} className={pathname.startsWith("/team") ? styles.selected : ""}>
      TEAM
    </Link>
  </div>
}
