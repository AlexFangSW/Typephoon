'use client'
import styles from "./YellowButton.module.scss"

export default function YellowButton({ text, action = () => { } }: { text: string, action?: Function }) {
  return <>
    <button className={`${styles.color} base_button`} onClick={() => { action() }}>{text}</button>
  </>
}
