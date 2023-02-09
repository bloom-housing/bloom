import React from "react"
import { LinkButton } from "../../../detroit-ui-components/src/actions/LinkButton"
import { Icon, IconTypes } from "../../../detroit-ui-components/src/icons/Icon"

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
      <div className="py-6 px-5 md:py-8">
        <Icon
          fill="black"
          size="xlarge"
          symbol={iconSymbol}
          className="ml-2 px-2 info-cards__title"
        />
        <h2 className="font-semibold mt-0">{title}</h2>
        <div className="mb-4">{subtitle}</div>
        <LinkButton unstyled className="bg-opacity-0 ms-0" href={linkUrl}>
          {linkLabel}
        </LinkButton>
      </div>
    </div>
  )
}

export default ResourceLinkCard
