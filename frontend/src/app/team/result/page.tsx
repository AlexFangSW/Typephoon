import Title from "@/components/Title";
import styles from "./result.module.scss";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PerpleButton from "@/components/Buttons/PurpleButton";
import GraphDummy from "@/components/Graphs/GraphDummy";
import RankingGraph from "@/components/Graphs/RankingGraph";

export default function Page() {
  return (
    <div className={styles.container}>
      {/* WPM, ACC */}
      <Title title={`WPM: 90 ACC: 95`} />
      {/* ranking graph */}
      <RankingGraph />
      {/* buttons */}
      <div className={styles.button_container}>
        <PerpleButton>REPLAY</PerpleButton>
        <PrimaryButton>NEXT GAME</PrimaryButton>
      </div>
      {/* wpm graph */}
      <GraphDummy />
    </div>
  );
}
