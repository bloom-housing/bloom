import React from "react"
import { Heading, HeadingGroup } from "@bloom-housing/ui-seeds"
import styles from "./ContentPage.module.scss"

export interface ContentPageHeaderProps {
  /** Heading at the top of the page header */
  heading: string
  /** Description below the heading */
  subheading?: React.ReactNode
}

export interface ContentPageProps extends ContentPageHeaderProps {
  /** All content under the header banner */
  children: React.ReactNode
}

const ContentPageHeader = (props: ContentPageHeaderProps) => {
  const HeaderTitle = (
    <Heading size="4xl" priority={1} className={styles["header-text"]}>
      {props.heading}
    </Heading>
  )

  return (
    <div className={styles["header-container"]}>
      <div className={styles["header"]}>
        {props.subheading ? (
          <HeadingGroup
            heading={HeaderTitle}
            subheading={props.subheading}
            headingPriority={1}
            size="4xl"
            className={styles["header-text"]}
          ></HeadingGroup>
        ) : (
          HeaderTitle
        )}
      </div>
    </div>
  )
}

export const ContentPage = (props: ContentPageProps) => (
  <div className={styles["content-page"]}>
    <ContentPageHeader heading={props.heading} subheading={props.subheading} />
    <div className={styles["body"]}>{props.children}</div>
  </div>
)
