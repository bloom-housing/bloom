import { Icon, UniversalIconType } from "@bloom-housing/ui-components"
import { HeadingGroup } from "@bloom-housing/ui-seeds"
import Card from "@bloom-housing/ui-seeds/src/blocks/Card"
import React from "react"
import styles from "./account.module.scss"

interface AccountCardProps {
  iconSymbol: UniversalIconType
  title: string
  subtitle: string
  children: React.ReactElement
  id?: string
  divider?: "flush" | "inset"
  className?: string
}

const AccountCard = (props: AccountCardProps) => {
  const classNames = [styles["account-card"]]
  if (props.className) classNames.push(props.className)

  return (
    <Card spacing="lg" className={classNames.join(" ")}>
      <Card.Header divider={props?.divider}>
        <Icon size="2xl" className={styles["account-card-icon"]} symbol={props.iconSymbol} />
        <HeadingGroup
          size="2xl"
          heading={props.title}
          subheading={props.subtitle}
          className={styles["account-card-header"]}
        />
      </Card.Header>
      {props.children}
    </Card>
  )
}

export { AccountCard as default, AccountCard }
