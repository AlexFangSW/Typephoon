import Image from "next/image"
import styles from "./Attribution.module.scss"

export default function Attribution() {
  return (
    <div className={styles.container} >
      <div className={styles.attribution_container}>
        {/* main icon */}
        <div className={styles.attribution}>
          <Image
            src="/typephoonIcon.png"
            alt="Icon"
            width={35}
            height={35}
          />
          <a href="https://www.flaticon.com/free-icons/wireless-keyboard" title="wireless keyboard icons">Wireless keyboard icons created by Freepik - Flaticon</a>
        </div>

        {/* user profile */}
        <div className={styles.attribution}>
          <Image
            src="/profile.svg"
            alt="Profile"
            width={35}
            height={35}
          />
          <div>
            Icon by <a href="https://freeicons.io/profile/2257">www.wishforge.games</a> on <a href="https://freeicons.io">freeicons.io</a>
          </div>
        </div>

        {/* github */}
        <div className={styles.attribution}>
          <Image
            src="/github.svg"
            alt="GitHub"
            width={35}
            height={35}
          />
          <div>
            Icon by <a href="https://freeicons.io/profile/3">icon king1</a> on <a href="https://freeicons.io">freeicons.io</a>
          </div>
        </div>

        {/* gitbranch */}
        <div className={styles.attribution}>
          <Image
            src="/gitbranch.svg"
            alt="Git branch"
            width={35}
            height={35}
          />
          <div>
            Icon by <a href="https://freeicons.io/profile/3">icon king1</a> on <a href="https://freeicons.io">freeicons.io</a>
          </div>
        </div>

        {/* attribution */}
        <div className={styles.attribution}>
          <Image
            src="/attribute.svg"
            alt="attribution"
            width={35}
            height={35}
          />
          <div>
            Icon by <a href="https://freeicons.io/profile/126253">ToZIcon</a> on <a href="https://freeicons.io">freeicons.io</a>
          </div>
        </div>
      </div>
    </div>
  )
}
