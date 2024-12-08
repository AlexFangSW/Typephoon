'use client'
import styles from "./LogoutButton.module.scss"

async function logout() {
  await fetch(`/api/v1/auth/logout`)
  window.location.href = "/"
}

export default function LogoutButton() {
  return <>
    <button className={`${styles.button}`} onClick={() => { logout() }}>
      [ Logout ]
    </button>
  </>
}
