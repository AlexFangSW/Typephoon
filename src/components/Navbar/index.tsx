import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import GameModes from "./gameModes";
import { verifyLogin } from "@/middleware";
import LogoutButton from "../Buttons/LogoutButton";

export default async function Navbar() {
  const isLoggedIn = await verifyLogin();

  return (
    <>
      <div className={styles.container}>
        {/* icon */}
        <Link href={"/"} className={styles.icon}>
          <Image src="/typephoonIcon.png" alt="Icon" width={35} height={35} />
          <div>TYPEPHOON</div>
        </Link>

        {/* game modes */}
        <GameModes />

        {/* user profile */}
        <div className={styles.profile}>
          {isLoggedIn ? <Link href={"/profile"}>Profile |</Link> : ""}

          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <a href="/login">Login</a>
          )}
        </div>

      </div >
    </>
  );
}
