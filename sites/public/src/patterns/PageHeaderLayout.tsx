import React from "react"
import { Heading, HeadingGroup } from "@bloom-housing/ui-seeds"
import MaxWidthLayout from "../layouts/max-width"
import styles from "./PageHeaderLayout.module.scss"

export interface PageHeaderProps {
  /** Heading at the top of the page header */
  heading: React.ReactNode
  /** Description below the heading */
  subheading?: React.ReactNode
  /** Content to show below the subtitle */
  content?: React.ReactNode
}

export interface PageHeaderLayoutProps extends PageHeaderProps {
  /** All content under the header banner */
  children: React.ReactNode
  /** Determines header banner styling */
  inverse?: boolean
  /** Class name applied to container */
  className?: string
}

export const PageHeaderSection = (props: Omit<PageHeaderLayoutProps, "children">) => {
  const classNames = [styles["page-header-layout"]]
  if (props.inverse) classNames.push(styles["is-inverse"])
  if (props.className) classNames.push(props.className)
  return (
    <div className={classNames.join(" ")}>
      <PageHeader heading={props.heading} subheading={props.subheading} content={props.content} />
    </div>
  )
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className={styles["page-header-background"]}>
      <div className={styles["page-header-outer"]}>
        <MaxWidthLayout>
          <div className={styles["page-header-inner"]}>
            {props.subheading ? (
              <HeadingGroup
                heading={props.heading}
                subheading={props.subheading}
                headingProps={{ priority: 1, size: "4xl" }}
                className={styles["page-header-text-group"]}
              />
            ) : (
              <Heading size="4xl" priority={1} className={styles["page-header-text"]}>
                {props.heading}
              </Heading>
            )}
          </div>
        </MaxWidthLayout>
      </div>
      {props.content && props.content}
    </div>
  )
}

export const PageHeaderLayout = (props: PageHeaderLayoutProps) => {
  const classNames = [styles["page-header-layout"]]
  if (props.inverse) classNames.push(styles["is-inverse"])
  if (props.className) classNames.push(props.className)

  return (
    <div className={classNames.join(" ")}>
      <PageHeader heading={props.heading} subheading={props.subheading} />
      <div className={styles["page-content-outer"]}>
        <div className={styles["page-content-inner"]}>
          <MaxWidthLayout>{props.children} </MaxWidthLayout>
        </div>
      </div>
    </div>
  )
}
