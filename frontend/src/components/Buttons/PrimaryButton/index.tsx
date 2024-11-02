'use client'
import styles from "./PrimaryButton.module.scss"

export default function PrimaryButton({ text, action = () => { } }: { text: string, action?: Function }) {
  return <>
    <button className={`${styles.color} base_button`} onClick={() => { action() }}>{text}</button>
  </>
}
