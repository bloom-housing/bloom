import React from "react"
import "./CardShared.scss"
import { CardHeader } from "./CardHeader"
import { CardImage } from "./CardImage"
import { CardSection } from "./CardSection"
import { CardFooter } from "./CardFooter"

interface ContainerProps {
  headerTop?: boolean
  row?: boolean
  children: React.ReactElement[]
}

// see: https://mparavano.medium.com/find-filter-react-children-by-type-d9799fb78292
const slotElements = (children: React.ReactElement[], type: string) => {
  return children.filter((child) => child.props.__TYPE === type)
}

const CardContainer = (props: ContainerProps) => {
  const imageChildren = slotElements(props.children, "CardImage")
  const headerChildren = slotElements(props.children, "CardHeader")
  const sectionChildren = slotElements(props.children, "CardSection")
  const footerChildren = slotElements(props.children, "CardFooter")

  const dense = sectionChildren.length > 1

  return (
    <div className={`card__container ${props.row ? "flex-row" : ""} ${dense ? "is-dense" : ""}`}>
      {props.headerTop ? (
        <>
          {headerChildren}
          {imageChildren}
        </>
      ) : (
        <>
          {imageChildren}
          {headerChildren}
        </>
      )}
      {sectionChildren}
      {footerChildren}
    </div>
  )
}

CardContainer.Header = CardHeader
CardContainer.Image = CardImage
CardContainer.Section = CardSection
CardContainer.Footer = CardFooter

export { CardContainer as default, CardContainer }
