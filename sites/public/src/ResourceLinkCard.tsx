import React from "react"
import { LinkButton, Icon } from "@bloom-housing/ui-components"
import { IconTypes } from "../../../ui-components/src/icons/Icon"

interface ResourceLinkCardProps {
  iconSymbol: IconTypes
  title: string
  subtitle: string
  linkUrl: string
  linkLabel: string
}

const ResourceLinkCard = (props: ResourceLinkCardProps) => {
  const { iconSymbol, title, subtitle, linkUrl, linkLabel } = props

  return (
    <div className="border-b">
      <div className="my-6 px-5 md:my-12">
        <Icon
          fill="black"
          size="xlarge"
          symbol={iconSymbol}
          className="ml-2 px-2 info-cards__title"
        />
        <h3 className="font-semibold mt-0">{title}</h3>
        <div className="mb-4">{subtitle}</div>
        <LinkButton unstyled className="bg-opacity-0 ms-0" href={linkUrl}>
          {linkLabel}
        </LinkButton>
      </div>
    </div>
  )
}

export default ResourceLinkCard
