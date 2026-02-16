import Link from "next/link"
import { t } from "@bloom-housing/ui-components"
import { Heading, Card } from "@bloom-housing/ui-seeds"
import { BloomCard } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../layouts/application"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "./Assistance.module.scss"
import { isFeatureFlagOn } from "../../lib/helpers"

interface AssistanceProps {
  jurisdiction: Jurisdiction
}

const Assistance = (props: AssistanceProps) => {
  const enableResources = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableResources)

  return (
    <Layout pageTitle={t("pageTitle.getAssistance")}>
      <PageHeaderLayout
        heading={t("pageTitle.getAssistance")}
        inverse
        subheading={t("pageDescription.getAssistance")}
        className={styles["site-layout"]}
      >
        <article className={styles["site-content"]}>
          <div className={styles["items-wrapper"]}>
            <BloomCard
              title={t("assistance.applyToHousingTitle")}
              subtitle={t("assistance.applyToHousingDescription")}
              headingPriority={2}
              iconSymbol={"home"}
              iconOutlined={true}
              variant={"block"}
              className={styles["item"]}
              iconClass="card-icon"
            >
              <Card.Section className={styles["item-link"]}>
                <Link href={"/housing-basics"}>{t("assistance.applyToHousingLink")}</Link>
              </Card.Section>
            </BloomCard>
            {enableResources && (
              <BloomCard
                title={t("assistance.additionalHousingTitle")}
                subtitle={t("assistance.additionalHousingDescription")}
                headingPriority={2}
                iconSymbol={"listBullet"}
                iconOutlined={true}
                variant={"block"}
                className={styles["item"]}
                iconClass="card-icon"
              >
                <Card.Section className={styles["item-link"]}>
                  <Link href={"/additional-resources"}>
                    {t("assistance.additionalHousingLink")}
                  </Link>
                </Card.Section>
              </BloomCard>
            )}
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
      </PageHeaderLayout>
    </Layout>
  )
}

export default Assistance
