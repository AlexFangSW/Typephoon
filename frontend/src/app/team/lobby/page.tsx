import PrimaryButton from "@/components/Buttons/PrimaryButton"
import styles from "./lobby.module.scss"
import RedButton from "@/components/Buttons/RedButton"
import CopyIcon from "@/components/Icons/CopyIcon"
import CrownIcon from "@/components/Icons/CrownIcon"

function InviteToken({ token }: { token: string }) {
  return <div className={styles.token_container}>
    <div className={styles.token_label} >INVITE TOKEN:</div>
    <div className={styles.token}>
      <div >{token}</div>
      <PrimaryButton >
        <CopyIcon />
      </PrimaryButton>
    </div>
  </div >
}

function PlayerListItem(
  {
    isLeader,
    username,
    pb,
    id
  }:
    {
      isLeader: boolean,
      username: string,
      pb: string,
      id: string
    }) {

  return <tr>
    <td>{isLeader ? <CrownIcon /> : ""}</td>
    <td>{username}</td>
    <td>{pb}</td>
    <td>{isLeader ? "" : <RedButton>REMOVE</RedButton>}</td>
  </tr>

}

function PlayerList() {
  return <table className={styles.table}>
    <tbody>
      <tr>
        <th></th>
        <th>Username</th>
        <th>PB(WPM/ACC)</th>
        <td></td>
      </tr>
      <PlayerListItem isLeader={true} username={"AlexFangSW"} pb={"95/90"} id={"aaa"} />
      <PlayerListItem isLeader={false} username={"AlexFangSW"} pb={"95/90"} id={"aaa"} />
      <PlayerListItem isLeader={false} username={"AlexFangSW"} pb={"95/90"} id={"aaa"} />
      <PlayerListItem isLeader={false} username={"AlexFangSW"} pb={"95/90"} id={"aaa"} />
      <PlayerListItem isLeader={false} username={"AlexFangSW"} pb={"95/90"} id={"aaa"} />
    </tbody>
  </table>
}

// TODO: THe team leader and members will see different versions of this page
// Leader exclusive:
// - token
// - remove member button
// - start button
export default function Page() {
  return <div className={styles.container}>
    {/* invite token */}
    <InviteToken token="f55a54db-76ac-43d7-a51d-fa6a300f3216" />
    {/* player list */}
    <PlayerList />
    {/* buttons */}
    <div className={styles.button_container}>
      <RedButton>LEAVE</RedButton>
      <PrimaryButton>START</PrimaryButton>
    </div>
  </div>
}
