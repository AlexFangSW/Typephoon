'use client'
import { useRouter } from "next/navigation"
import styles from "./LogoutButton.module.scss"

export default function LogoutButton() {
  return <>
    <button className={`${styles.button}`} onClick={async () => {
      await fetch(`/api/v1/auth/logout`, { cache: 'no-store' })
      window.location.href = "/"
    }}>
      Logout
    </button>
  </>
}
