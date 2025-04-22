import Attribution from "@/components/Attibution";
import styles from "./attributions.module.scss";
import Title from "@/components/Title";

export default function Page() {
  return (
    <div className={styles.container}>
      <Title title="ATTRIBUTION" />
      <Attribution />
    </div>
  );
}
