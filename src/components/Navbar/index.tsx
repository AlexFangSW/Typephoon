import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import { verifyLogin, getUsername } from "@/middleware";
import LogoutButton from "../Buttons/LogoutButton";

function UserIcon() {
  return <Image src="/user.svg" alt="user" width={30} height={30} />;
}

function StatisticsIcon() {
  return (
    <Image src="/statistics.svg" alt="statistics" width={30} height={30} />
  );
}

export default async function Navbar() {
  const isLoggedIn = await verifyLogin();
  let username = "";
  if (isLoggedIn) {
    username = await getUsername();
  }

  return (
    <>
      <div className={styles.container}>
        {/* icon */}
        <a href={"/"} className={styles.icon}>
          <Image src="/typephoonIcon.png" alt="Icon" width={35} height={35} />
          <div className={styles.name}>TYPEPHOON</div>
        </a>

        {/* game modes ( currently only multi player mode is available ) */}
        {/* <GameModes /> */}

        {/* user profile */}
        <div className={styles.profile}>
          {isLoggedIn ? (
            <>
              <a href={"/profile"}>
                <StatisticsIcon />
                <span className={styles.name}>{username}</span>
              </a>
              <span>|</span>
            </>
          ) : (
            ""
          )}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <a href="/login">
              <UserIcon />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
