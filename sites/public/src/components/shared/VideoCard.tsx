import { Card, Icon } from "@bloom-housing/ui-seeds"
import { PlayCircleIcon } from "@heroicons/react/16/solid"
import styles from "./VideoCard.module.scss"

export interface VideoCardProps {
  title: string
  content: string
  onClick: () => void
}

const VideoCard = ({ title, content, onClick }: VideoCardProps) => {
  return (
    <Card spacing="sm">
      <button onClick={onClick}>
        <Card.Header className={styles["video-card-header"]}>
          <Icon size="xl">
            <PlayCircleIcon />
          </Icon>
        </Card.Header>
      </button>
      <Card.Section>
        <button className={styles["video-card-title"]} onClick={onClick}>
          {title}
        </button>
        <div className={styles["video-card-content"]}>{content}</div>
      </Card.Section>
    </Card>
  )
}

export default VideoCard
