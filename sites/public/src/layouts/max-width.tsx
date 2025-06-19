import React from "react"
import styles from "./max-width.module.scss"

interface MaxWidthLayoutProps {
  children: React.ReactNode
  className?: string
}

const MaxWidthLayout = (props: MaxWidthLayoutProps) => {
  return (
    <div className={styles["max-width-layout"]}>
      <div
        className={`${styles["layout-max-width-container"]} ${
          props.className ? props.className : ""
        }`}
      >
        <div className={styles["layout-max-width-content"]}>{props.children}</div>
      </div>
    </div>
  )
}

export default MaxWidthLayout
