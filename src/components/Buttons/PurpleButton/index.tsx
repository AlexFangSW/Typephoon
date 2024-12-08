"use client";
import { ReactNode } from "react";
import styles from "./PurpleButton.module.scss";

export default function PurpleButton({
  children,
  action = () => { },
  className = "",
}: {
  children?: ReactNode;
  action?: () => void;
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
