import styles from "./login.module.scss";
import GoogleLoginButton from "@/components/Buttons/GoogleLogin";
import { redirectToLogin } from "./actions";

export default function Page() {
  return (
    <div className={styles.container}>
      <GoogleLoginButton action={redirectToLogin} />
    </div>
  );
}
