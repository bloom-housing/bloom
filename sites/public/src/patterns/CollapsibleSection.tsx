import React, { useState } from "react"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import { Heading, Icon } from "@bloom-housing/ui-seeds"
import styles from "./CollapsibleSection.module.scss"
import { t } from "@bloom-housing/ui-components"

interface CollapsibleSectionProps {
  /** All content under the title */
  children: React.ReactNode
  /** Class name applied around children */
  contentClassName?: string
  /** Heading priority level */
  priority?: 1 | 2 | 3 | 4 | 5 | 6
  /** Appears below the title */
  subtitle?: string | React.ReactNode
  /** Title of the section */
  title: string
}

export const CollapsibleSection = (props: CollapsibleSectionProps) => {
  const [collapsed, setCollapsed] = useState(false)

  const HeadingContent = (
    <>
      <Heading priority={props.priority} size={"xl"} className={styles["heading"]}>
        {props.title}
      </Heading>
      {props.subtitle && <div>{props.subtitle}</div>}
    </>
  )

  return (
    <div
      className={`${styles["collapsible-section"]} ${collapsed ? styles["collapsed-section"] : ""}`}
    >
      <div className={"sr-only"}>{HeadingContent}</div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={!collapsed ? t("t.collapseSection") : t("t.expandSection")}
        aria-expanded={!collapsed}
        aria-controls={props.title}
        className={styles["collapsible-button"]}
      >
        <div className={styles["header"]}>
          <div className={styles["header-content"]}>{HeadingContent}</div>
          <div className={styles["button-container"]}>
            <div className={styles["header-button"]}>
              {collapsed ? (
                <Icon size={"lg"}>
                  <PlusIcon />
                </Icon>
              ) : (
                <Icon size={"lg"}>
                  <MinusIcon />
                </Icon>
              )}
            </div>
          </div>
        </div>
      </button>
      {!collapsed && (
        <div
          className={`${styles["content"]} ${props.contentClassName ? props.contentClassName : ""}`}
          id={props.title}
        >
          {props.children}
        </div>
      )}
    </div>
  )
}
