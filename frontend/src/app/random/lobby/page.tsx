import PrimaryButton from "@/components/Buttons/PrimaryButton"
import styles from "./lobby.module.scss"
import RedButton from "@/components/Buttons/RedButton"

function InviteToken({ token }: { token: string }) {
  return <div className={styles.token_container}>
    <div className={styles.token_label} >INVITE TOKEN:</div>
    <div className={styles.token}>
      <div >{token}</div>
      <PrimaryButton text="🗐" />
    </div>
  </div >
}

function PlayerListItem(
  {
    isUser,
    username,
    pb,
    justStart
  }:
    {
      isUser: boolean,
      username: string,
      pb: string,
      justStart: boolean
    }) {

  return <tr>
    <td>{isUser ? "⦾" : ""}</td>
    <td>{username}</td>
    <td>{pb}</td>
    <td>{justStart ? "✓" : ""}</td>
  </tr>

}

function PlayerList() {
  return <table className={styles.table}>
    <tbody>
      <tr>
        <th></th>
        <th>Username</th>
        <th>PB(WPM/ACC)</th>
        <th>Ready</th>
        {/* 'Just start' status */}
        <th></th>
      </tr>
      <PlayerListItem isUser={true} justStart={true} username={"AlexFangSW"} pb={"95/90"} />
      <PlayerListItem isUser={false} justStart={false} username={"AlexFangSW"} pb={"95/90"} />
      <PlayerListItem isUser={false} justStart={false} username={"AlexFangSW"} pb={"95/90"} />
      <PlayerListItem isUser={false} justStart={true} username={"AlexFangSW"} pb={"95/90"} />
      <PlayerListItem isUser={false} justStart={false} username={"AlexFangSW"} pb={"95/90"} />
    </tbody>
  </table>
}

export default function Page() {
  return <div className={styles.container}>
    {/* player list */}
    <PlayerList />
    {/* countdown */}
    <div>{"[ The game will start in 30 seconds ]"}</div>
    {/* buttons */}
    <div className={styles.button_container}>
      <RedButton text="LEAVE" />
      <PrimaryButton text="READY" />
    </div>
  </div>
}
