import { Heading, Grid } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import styles from "./ResourceSection.module.scss"

export interface ResourceSectionProps {
  sectionTitle: string
  sectionSubtitle?: string
  cards?: React.ReactNode[]
  cardsWithTitles?: { cards: React.ReactNode[]; title: string }[]
}

const ResourceSection = ({
  sectionTitle,
  sectionSubtitle,
  cards,
  cardsWithTitles,
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
      {cards && (
        <Grid spacing="sm">
          <GridRow columns={3}>{cards}</GridRow>
        </Grid>
      )}
      {cardsWithTitles &&
        cardsWithTitles.map((group, index) => (
          <div key={index}>
            <Heading className={styles["resource-section-subsection-title"]} priority={3}>
              {group.title}
            </Heading>
            <Grid spacing="sm">
              <GridRow columns={3}>{group.cards}</GridRow>
            </Grid>
          </div>
        ))}
    </div>
  )
}

export default ResourceSection
