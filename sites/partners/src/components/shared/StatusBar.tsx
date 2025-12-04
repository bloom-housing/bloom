import * as React from "react"
import styles from "./StatusBar.module.scss"

export interface StatusBarProps {
  backButton?: React.ReactNode
  children: React.ReactNode
}

const StatusBar = (props: StatusBarProps) => {
  return (
    <section className={styles["status-bar"]}>
      {props.children && (
        <div
          className={`${styles["status-bar__row"]} ${!props.backButton ? styles["tag-only"] : ""}`}
        >
          {props.backButton}
          <div className={styles["status-bar__tag"]}>{props.children}</div>
        </div>
      )}
    </section>
  )
}

export { StatusBar as default, StatusBar }
