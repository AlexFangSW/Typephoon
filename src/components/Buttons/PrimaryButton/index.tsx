'use client'
import { ReactNode } from "react"
import styles from "./PrimaryButton.module.scss"

export default function PrimaryButton(
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
