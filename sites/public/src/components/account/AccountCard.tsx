import { HeadingGroup, Icon } from "@bloom-housing/ui-seeds"
import Card from "@bloom-housing/ui-seeds/src/blocks/Card"
import React from "react"
import styles from "./AccountCard.module.scss"
import { CustomIconMap } from "../shared/CustomIconMap"

interface AccountCardProps {
  iconSymbol: "application" | "profile"
  title: string
  subtitle: string
  children: React.ReactElement
  id?: string
  divider?: "flush" | "inset"
  headingPriority?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const AccountCard = (props: AccountCardProps) => {
  const classNames = [styles["account-card"]]
  if (props.className) classNames.push(props.className)

  const customIcon = CustomIconMap[props.iconSymbol]

  return (
    <Card spacing="lg" className={classNames.join(" ")}>
      <Card.Header divider={props?.divider}>
        <Icon size="2xl" className={styles["account-card-icon"]}>
          {customIcon}
        </Icon>
        <HeadingGroup
          size="2xl"
          heading={props.title}
          subheading={props.subtitle}
          className={styles["account-card-header"]}
          headingPriority={props.headingPriority}
        />
      </Card.Header>
      {props.children}
    </Card>
  )
}

export { AccountCard as default, AccountCard }
