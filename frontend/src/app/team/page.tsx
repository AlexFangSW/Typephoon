import PrimaryButton from "@/components/Buttons/PrimaryButton";
import style from "./team.module.scss"


function InviteTokenInput() {
  return <div className={style.invite_token_container}>
    <label htmlFor="invite_token">ENTER INVITE TOKEN</label>
    <input type="text" autoComplete="off" id="invite_token" placeholder="TOKEN" name="invite_token" />
    <PrimaryButton text="JOIN TEAM" className={style.button_fit} />
  </div>
}

export default function Page() {
  return <div className={style.container}>
    {/* invite token */}
    <InviteTokenInput />
    <hr />
    {/* create team button */}
    <PrimaryButton text="CREATE TEAM" className={style.button_fit} />
  </div>
}
