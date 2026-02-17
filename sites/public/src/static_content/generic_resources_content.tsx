import { t } from "@bloom-housing/ui-components"
import { Card, Grid, Heading, Link } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import ResourceSection from "../components/resources/ResourceSection"
import styles from "../components/resources/Resources.module.scss"
import ResourceCard from "../components/resources/ResourceCard"

export const getGenericResourcesContent = (): React.ReactNode => {
  const mockCard = (
    <ResourceCard
      title={t("resources.mockCardTitle")}
      href="/"
      content={t("resources.mockCardDescription")}
    />
  )
  return (
    <article className={styles["site-content"]}>
      <div className={styles["resources-section-wrapper"]}>
        <ResourceSection
          sectionTitle={t("resources.immediateHousingTitle")}
          sectionSubtitle={t("resources.immediateHousingSubtitle")}
        >
          <Grid spacing="sm">
            <GridRow columns={3}>{Array.from({ length: 30 }, () => mockCard)}</GridRow>
          </Grid>
        </ResourceSection>
        <ResourceSection sectionTitle={t("resources.housingProgramsTitle")}>
          <Grid spacing="sm">
            <GridRow columns={3}>{Array.from({ length: 30 }, () => mockCard)}</GridRow>
          </Grid>
        </ResourceSection>
      </div>
      <aside className={styles["aside-section"]}>
        <Card className={styles["contact-card"]}>
          <div className={styles["contact-card-subsection"]}>
            <Heading size="xl" priority={2}>
              {t("resources.contactTitle")}
            </Heading>
            <p className={styles["contact-card-description"]}>
              {t("resources.contactDescription")}
            </p>
          </div>
          <div className={styles["contact-card-subsection"]}>
            <p className={styles["contact-card-info"]}>{t("resources.contactInfo")}</p>
            <Link href={`mailto:${t("resources.contactEmail")}`}>
              {t("resources.contactEmail")}
            </Link>
          </div>
        </Card>
      </aside>
    </article>
  )
}
