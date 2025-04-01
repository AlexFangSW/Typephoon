import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

function ReleaseVersion({ version }: { version: string }) {
  return (
    <div className={styles.item}>
      <Image src="/gitbranch.svg" alt="gitbranch" width={20} height={20} />
      {version}
    </div>
  );
}

function GitHubRepo() {
  return (
    <Link className={styles.item} href={"/"}>
      <Image src="/github.svg" alt="github" width={20} height={20} />
      source
    </Link>
  );
}

function AttributeLink() {
  return (
    <Link className={styles.item} href={"/attributions"}>
      <Image src="/attribute.svg" alt="attribute" width={20} height={20} />
      attributions
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.section}>
        <AttributeLink />
      </div>
      <div className={styles.section}>
        <ReleaseVersion version="0.0.1-dev" />
        <GitHubRepo />
      </div>
    </footer>
  );
}
