import React from "react"
import styles from "./max-width.module.scss"

interface MaxWidthLayoutProps {
  children: React.ReactNode
}

const MaxWidthLayout = (props: MaxWidthLayoutProps) => {
  return (
    <div className={styles["layout-max-width-container"]}>
      <div className={styles["layout-max-width-content"]}>{props.children}</div>
    </div>
  )
}

export default MaxWidthLayout
