import React, { useState } from "react"
import { Card, CardProps, Heading, generateJumplinkId } from "../../.."
import "./DoorwayLinkableCardGroup.scss"
import Link from "next/link"
import { RowPositionUtils } from "ag-grid-community"

type DoorwayLinkableCardGroupProps = {
  cards: React.ReactElement<CardProps>[]
  children?: React.ReactNode
  className?: string
}

const DoorwayLinkableCardGroup = (props: DoorwayLinkableCardGroupProps) => {
  const getLinks = () => {
    const links = []
    for (const card of props.cards) {
      if (card.props?.jumplinkData) {
        const jumplinkData = card.props.jumplinkData
        const jumpLinkId = generateJumplinkId(jumplinkData)
        links.push(
          <Link key={jumpLinkId} href={`#${jumpLinkId}`}>
            {jumplinkData.title}
          </Link>
        )
      }
    }
    return links
  }

  const [isExpanded, setExpanded] = useState(false)
  const rootClassNames = props.className ? `${props.className}` : ""

  return (
    <div className={`doorway-linkable-card-group ${rootClassNames}`}>
      <div className="doorway-linkable-card-group_nav font-serif mt-4">
        <Card className="border-0 space-y-3">{getLinks()}</Card>
      </div>
      <div className="doorway-linkable-card-group_main">
        {props.children}
        {props.cards}
      </div>
    </div>
  )
}

export { DoorwayLinkableCardGroup as default, DoorwayLinkableCardGroup }
