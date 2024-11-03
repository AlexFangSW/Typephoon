'use client'
import styles from "./RedButton.module.scss"

export default function RedButton(
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
