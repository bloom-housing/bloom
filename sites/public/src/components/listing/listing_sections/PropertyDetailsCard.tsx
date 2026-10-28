import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import listingStyles from "../ListingViewSeeds.module.scss"

type PropertyDetailsCardProps = {
  heading: string
  linkUrl?: string
  linkText?: string
  propertyDescription?: string
}

export const PropertyDetailsCard = ({
  heading,
  linkText,
  linkUrl,
  propertyDescription,
}: PropertyDetailsCardProps) => {
  if (!linkUrl && !propertyDescription) return null

  return (
    <Card
      className={`${listingStyles["mobile-full-width-card"]} ${listingStyles["mobile-no-bottom-border"]}`}
    >
      <Card.Section>
        <Heading size="lg" priority={2} className="seeds-m-be-header">
          {heading}
        </Heading>
        {propertyDescription && <div className="seeds-m-bs-2">{propertyDescription}</div>}
        {linkUrl && (
          <p className="seeds-m-bs-text">
            <Link href={linkUrl} hideExternalLinkIcon={true}>
              {linkText || linkUrl}
            </Link>
          </p>
        )}
      </Card.Section>
    </Card>
  )
}
