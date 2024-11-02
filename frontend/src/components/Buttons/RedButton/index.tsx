'use client'
import styles from "./RedButton.module.scss"

export default function RedButton({ text, action = () => { } }: { text: string, action?: Function }) {
  return <>
    <button className={`${styles.color} base_button`} onClick={() => { action() }}>{text}</button>
  </>
}
