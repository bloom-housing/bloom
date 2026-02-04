import * as React from "react"
import { Card, Heading } from "@bloom-housing/ui-seeds"

type PropertyDetailsCardProps = {
  heading: string
  children: React.ReactNode
  linkUrl: string
  linkText: string
}

export const PropertyDetailsCard = ({
  heading,
  linkText,
  linkUrl,
  children,
}: PropertyDetailsCardProps) => {
  return (
    <Card>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {heading}
        </Heading>
        <div className={"seeds-m-bs-2"}>{children}</div>
        <p className="mt-3">
          <a href={linkUrl} target="_blank" className={"pr-2"}>
            {linkText}
          </a>
        </p>
      </Card.Section>
    </Card>
  )
}
