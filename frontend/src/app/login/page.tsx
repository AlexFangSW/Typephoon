import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./login.module.scss"

export default function Page() {
  return <div className={styles.container}>
    <PrimaryButton>LOGIN WITH GOOGLE</PrimaryButton>
  </div>
}
