import React from "react"
import Link from "next/link"
import { Card, CardProps, generateJumplinkId } from "@bloom-housing/doorway-ui-components"
import styles from "./DoorwayLinkableCardGroup.module.scss"

type DoorwayLinkableCardGroupProps = {
  cards: React.ReactElement<CardProps>[]
  children?: React.ReactNode
  className?: string
}

const DoorwayLinkableCardGroup = (props: DoorwayLinkableCardGroupProps) => {
  const getLinks = () => {
    const links = []
    if (!props.cards?.length) {
      return []
    }
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

  const rootClassNames = props.className ? `${props.className}` : ""

  return (
    <div className={`${styles["doorway-linkable-card-group"]} ${rootClassNames}`}>
      <div className={`${styles["doorway-linkable-card-group_nav"]} font-serif mt-4`}>
        <Card className="border-0">{getLinks()}</Card>
      </div>
      <div>
        {props.children}
        {props.cards}
      </div>
    </div>
  )
}

export { DoorwayLinkableCardGroup as default, DoorwayLinkableCardGroup }
