'use client'
import styles from "./PerpleButton.module.scss"

export default function PerpleButton(
  {
    text,
    action = () => { },
    className = ""
  }:
    {
      text: string,
      action?: Function,
      className?: string
    }) {
  return <>
    <button className={`${styles.color} base_button ${className}`} onClick={() => { action() }}>{text}</button>
  </>
}
