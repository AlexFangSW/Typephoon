'use client'
import styles from "./YellowButton.module.scss"

export default function YellowButton(
  {
    children,
    action = () => { },
    className = ""
  }:
    {
      children: React.ReactNode,
      action?: Function,
      className?: string
    }) {
  return <>
    <button className={`${styles.color} base_button ${className}`} onClick={() => { action() }}>
      {children}
    </button>
  </>
}
