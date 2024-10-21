import React from "react"
import { Heading } from "@bloom-housing/ui-components"
import styles from "./DoorwaySection.module.scss"

type DoorwaySectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}

const DoorwaySection = ({ children, title, className }: DoorwaySectionProps) => {
  const rootClassNames = className ? `${className}` : ""

  return (
    <div className={`${styles["doorway-expanded-section"]} ${rootClassNames}`}>
      <div className={styles["doorway-expanded_heading-container"]}>
        <Heading priority={4} className={"text__large-primary text-left"}>
          {title}
        </Heading>
      </div>
      <div className={styles["doorway-expanded_section"]}>{children}</div>
    </div>
  )
}

export { DoorwaySection as default, DoorwaySection }
