import React from "react"
import styles from "./TabView.module.scss"

type TabViewProps = {
  children: React.ReactNode
  tabs: React.ReactNode
  hideTabs: boolean
  styles?: {
    parentStyles?: string
    sectionStyles?: string
    contentStyles?: string
  }
}

export const TabView = (props: TabViewProps) => {
  return (
    <div className={`${styles["tab-view"]} ${props.styles?.parentStyles}`}>
      <div className={`${styles["section-container"]} ${props.styles?.sectionStyles}`}>
        {!props.hideTabs && <> {props.tabs}</>}
        <div className={`${styles["content-container"]} ${props.styles?.contentStyles}`}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
