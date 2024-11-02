import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./login.module.scss"

export default function Page() {
  return <div className={styles.container}>
    <h1></h1>
    <div>
      <PrimaryButton text="Login with Google" />
    </div>
  </div>
}
