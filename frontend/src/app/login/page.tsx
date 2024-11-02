import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./login.module.scss"

export default function Page() {
  return <div className={styles.container}>
    <PrimaryButton text="Login with Google" />
  </div>
}
