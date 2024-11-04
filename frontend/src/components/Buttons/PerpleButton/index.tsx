'use client'
import { ReactNode } from "react"
import styles from "./PerpleButton.module.scss"

export default function PerpleButton(
  {
    children,
    action = () => { },
    className = ""
  }:
    {
      children?: ReactNode,
      action?: Function,
      className?: string
    }) {
  return <>
    <button className={`${styles.color} base_button ${className}`} onClick={() => { action() }}>
      {children}
    </button>
  </>
}
