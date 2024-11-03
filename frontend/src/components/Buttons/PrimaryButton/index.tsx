'use client'
import styles from "./PrimaryButton.module.scss"

export default function PrimaryButton(
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
