import { Heading } from "@bloom-housing/ui-seeds"
import styles from "./ResourceSection.module.scss"

export interface ResourceSectionProps {
  sectionTitle: string
  sectionSubtitle?: string
}

const ResourceSection = ({
  sectionTitle,
  sectionSubtitle,
  children,
}: React.PropsWithChildren<ResourceSectionProps>) => {
  return (
    <div>
      <div className={styles["resource-section-header"]}>
        <Heading className={styles["resource-section-title"]} priority={2}>
          {sectionTitle}
        </Heading>
        {sectionSubtitle && (
          <p className={styles["resource-section-subtitle"]}>{sectionSubtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export default ResourceSection
