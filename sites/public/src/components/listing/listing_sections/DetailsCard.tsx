import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import styles from "../ListingViewSeeds.module.scss"

type PropertyDetailsCardProps = {
  heading: string
  children: React.ReactNode
  linkUrl: string
  linkText: string
}

export const DetailsCard = ({ heading, linkText, linkUrl, children }: PropertyDetailsCardProps) => {
  return (
    <Card className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {heading}
        </Heading>
        <div className={"seeds-m-bs-2"}>{children}</div>
        <p className="mt-3">
          <a href={linkUrl} className={"pr-2"}>
            {linkText}
          </a>
        </p>
      </Card.Section>
    </Card>
  )
}
