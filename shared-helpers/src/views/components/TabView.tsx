import React from "react"
import styles from "./TabView.module.scss"

type TabViewProps = {
  children: React.ReactNode
  tabs: React.ReactNode
  hideTabs: boolean
}

export const TabView = (props: TabViewProps) => {
  return (
    <div className={styles["section-container"]}>
      {!props.hideTabs && <> {props.tabs}</>}
      <div className={styles["content-container"]}>{props.children}</div>
    </div>
  )
}
