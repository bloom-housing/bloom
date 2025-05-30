import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Heading, HeadingGroup, Icon } from "@bloom-housing/ui-seeds"
import Card from "@bloom-housing/ui-seeds/src/blocks/Card"
import React from "react"
import styles from "./BloomCard.module.scss"
import { CustomIconMap, CustomIconType } from "../CustomIconMap"
import { ClickableCard } from "./ClickableCard"

interface BloomCardProps {
  customIcon?: CustomIconType
  standardIcon?: IconDefinition
  title?: string
  subtitle?: string | React.ReactNode
  children: React.ReactElement
  id?: string
  headingPriority?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  iconClassName?: string
  variant?: "form" | "block"
  clickable?: boolean
  headerLink?: React.ReactNode
  iconClass?: string
  iconOutlined?: boolean
  iconSymbol?: CustomIconType
}

const BloomCard = (props: BloomCardProps) => {
  const classNames = [props.variant === "block" ? styles["block-card"] : styles["form-card"]]
  if (props.className) classNames.push(props.className)

  const iconClassNames = [styles["card-icon"]]
  if (props.iconClassName) iconClassNames.push(props.iconClassName)

  const getTitle = () => {
    if (props.title) {
      if (props.subtitle) {
        return (
          <HeadingGroup
            size="2xl"
            heading={props.title}
            subheading={props.subtitle}
            className={`${styles["card-heading-group"]} ${styles["card-heading"]}`}
            headingPriority={props.headingPriority || 1}
          />
        )
      }
      return (
        <Heading
          size="2xl"
          priority={props.headingPriority || 1}
          className={styles["card-heading"]}
        >
          {props.title}
        </Heading>
      )
    }
    return null
  }

  const title = getTitle()

  const cardContent = (
    <>
      {title && (
        <Card.Header divider={props.variant === "block" ? undefined : "inset"}>
          {props?.customIcon && (
            <Icon
              size="2xl"
              className={`${styles["card-icon"]} ${props.iconClass ? props.iconClass : ""}`}
              outlined={props.iconOutlined}
            >
              {CustomIconMap[props?.customIcon]}
            </Icon>
          )}
          {props?.standardIcon && (
            <Icon size="2xl" icon={props?.standardIcon} className={iconClassNames.join(" ")} />
          )}
          {props.headerLink && props.headerLink}
          {title}
        </Card.Header>
      )}
      {props.children}
    </>
  )

  return (
    <>
      {props.clickable ? (
        <ClickableCard cardProps={{ spacing: "lg" }} className={classNames.join(" ")}>
          {cardContent}
        </ClickableCard>
      ) : (
        <Card spacing="lg" className={classNames.join(" ")}>
          {cardContent}
        </Card>
      )}
    </>
  )
}

export { BloomCard as default, BloomCard }
