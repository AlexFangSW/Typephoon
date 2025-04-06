"use client";
import { ReactNode } from "react";
import styles from "./DarkButton.module.scss";

export default function DarkButton({
  children,
  action = () => {},
  className = "",
}: {
  children?: ReactNode;
  action?: Function;
  className?: string;
}) {
  return (
    <>
      <button
        className={`${styles.color} base_button ${className}`}
        onClick={() => {
          action();
        }}
      >
        {children}
      </button>
    </>
  );
}
