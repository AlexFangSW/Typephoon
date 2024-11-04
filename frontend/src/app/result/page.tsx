import Title from "@/components/Title";
import styles from "./result.module.scss"
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PerpleButton from "@/components/Buttons/PerpleButton";
import GraphDummy from "@/components/Graphs/GraphDummy";

export default function Page() {
  return <div className={styles.container}>
    {/* WPM, ACC */}
    <Title title={`WPM: 90 ACC: 95`} />
    {/* graph */}
    <GraphDummy />
    {/* buttons */}
    <div className={styles.button_container} >
      <PerpleButton >REPLAY</PerpleButton>
      <PrimaryButton >NEXT GAME</PrimaryButton>
    </div>
  </div>
}
