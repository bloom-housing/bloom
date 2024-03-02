import { Heading, HeadingGroup, Icon } from "@bloom-housing/ui-seeds"
import Card from "@bloom-housing/ui-seeds/src/blocks/Card"
import React from "react"
import styles from "./BloomCard.module.scss"
import { CustomIconMap, CustomIconType } from "../accounts/CustomIconMap"

interface BloomCardProps {
  iconSymbol?: CustomIconType
  title: string
  subtitle?: string
  children: React.ReactElement
  id?: string
  headingPriority?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  variant?: "form" | "block"
}

const BloomCard = (props: BloomCardProps) => {
  const classNames = [props.variant === "block" ? styles["block-card"] : styles["form-card"]]
  if (props.className) classNames.push(props.className)

  const customIcon = props.iconSymbol ? CustomIconMap[props.iconSymbol] : undefined

  return (
    <Card spacing="lg" className={classNames.join(" ")}>
      <Card.Header divider={props.variant === "block" ? undefined : "inset"}>
        {customIcon && (
          <Icon size="2xl" className={styles["card-icon"]}>
            {customIcon}
          </Icon>
        )}
        {props.subtitle ? (
          <HeadingGroup
            size="2xl"
            heading={props.title}
            subheading={props.subtitle}
            className={styles["card-heading-group"]}
            headingPriority={props.headingPriority}
          />
        ) : (
          <Heading size="2xl" className={styles["card-form-heading"]}>
            {props.title}
          </Heading>
        )}
      </Card.Header>
      {props.children}
    </Card>
  )
}

export { BloomCard as default, BloomCard }
