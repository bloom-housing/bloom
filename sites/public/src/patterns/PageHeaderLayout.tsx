import React from "react"
import { Heading, HeadingGroup } from "@bloom-housing/ui-seeds"
import styles from "./PageHeaderLayout.module.scss"

export interface PageHeaderProps {
  /** Heading at the top of the page header */
  heading: string
  /** Description below the heading */
  subheading?: React.ReactNode
}

export interface PageHeaderLayoutProps extends PageHeaderProps {
  /** All content under the header banner */
  children: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className={styles["page-header-background"]}>
      <div className={styles["page-header-outer"]}>
        <div className={styles["page-header-inner"]}>
          {props.subheading ? (
            <HeadingGroup
              heading={props.heading}
              subheading={props.subheading}
              size="4xl"
              headingPriority={1}
              className={styles["page-header-text-group"]}
            ></HeadingGroup>
          ) : (
            <Heading size="4xl" priority={1} className={styles["page-header-text"]}>
              {props.heading}
            </Heading>
          )}
        </div>
      </div>
    </div>
  )
}

export const PageHeaderLayout = (props: PageHeaderLayoutProps) => (
  <div>
    <PageHeader heading={props.heading} subheading={props.subheading} />
    <div className={styles["page-content-outer"]}>
      <div className={styles["page-content-inner"]}>{props.children}</div>
    </div>
  </div>
)
