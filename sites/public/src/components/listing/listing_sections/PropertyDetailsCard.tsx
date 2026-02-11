import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"

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
  return (
    <Card>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {heading}
        </Heading>
        <div className={"seeds-m-bs-2"}>{propertyDescription}</div>
        <p className={"seeds-m-bs-text"}>
          <Link href={linkUrl}>{linkText}</Link>
        </p>
      </Card.Section>
    </Card>
  )
}
