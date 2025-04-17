import { Card, Link } from "@bloom-housing/ui-seeds"
import styles from "./ResourceCard.module.scss"

export interface ResourceCardProps {
  title: string
  href: string
  content: string
}

const ResourceCard = ({ title, href, content }: ResourceCardProps) => {
  return (
    <Card className={styles["resource-card"]}>
      <Link href={href} className={styles["resource-card-title"]}>
        {title}
      </Link>
      <div className={styles["resource-card-content"]}>{content}</div>
    </Card>
  )
}

export default ResourceCard
