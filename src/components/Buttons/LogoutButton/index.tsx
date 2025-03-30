"use client";
import styles from "./LogoutButton.module.scss";
import Image from "next/image";

function LogoutIcon() {
  return <Image src="/logout.svg" alt="logout" width={30} height={30} />;
}

export default function LogoutButton() {
  return (
    <>
      <button
        className={`${styles.button}`}
        onClick={async () => {
          await fetch(`/api/v1/auth/logout`, {
            method: "POST",
            cache: "no-store",
          });
          window.location.href = "/";
        }}
      >
        <LogoutIcon />
      </button>
    </>
  );
}
