import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import styles from "../ListingViewSeeds.module.scss"

type PropertyDetailsCardProps = {
  heading: string
  description: string
  linkUrl: string
  linkText: string
}

export const DetailsCard = ({
  heading,
  linkText,
  linkUrl,
  description,
}: PropertyDetailsCardProps) => {
  return (
    <Card className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {heading}
        </Heading>
        {description}
        <Link href={linkUrl ?? ""} className={"seeds-m-bs-4"} newWindowTarget={true}>
          {linkText}
        </Link>
      </Card.Section>
    </Card>
  )
}
