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
        <Link href={"/"} className={styles.icon}>
          <Image src="/typephoonIcon.png" alt="Icon" width={35} height={35} />
          <div>TYPEPHOON</div>
        </Link>

        {/* game modes ( currently only multi player mode is available ) */}
        {/* <GameModes /> */}

        {/* user profile */}
        <div className={styles.profile}>
          {isLoggedIn ? (
            <Link href={"/profile"}>
              <StatisticsIcon />
              {username} |
            </Link>
          ) : (
            ""
          )}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link href="/login">
              <UserIcon />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
