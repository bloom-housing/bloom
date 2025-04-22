import { CustomIconMap, CustomIconType } from "@bloom-housing/shared-helpers"
import { Card, Heading, Icon, Link } from "@bloom-housing/ui-seeds"
import styles from "./AssistanceItem.module.scss"

type AssistanceItemProps = {
  iconSymbol: CustomIconType
  title: string
  description: string
  linkText: string
  href: string
}

const AssistanceItem = ({
  iconSymbol,
  title,
  description,
  linkText,
  href,
}: AssistanceItemProps) => {
  const customIcon = iconSymbol ? CustomIconMap[iconSymbol] : undefined
  return (
    <Card className={styles["assistance-card"]}>
      {customIcon && (
        <Icon outlined size="2xl">
          {customIcon}
        </Icon>
      )}
      <Heading priority={2} size="xl" className={styles["assistance-card-title"]}>
        {title}
      </Heading>
      <div className={styles["assistance-card-description"]}>{description}</div>
      <Link href={href}>{linkText}</Link>
    </Card>
  )
}

export default AssistanceItem
