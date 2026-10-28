import { t } from "@bloom-housing/ui-components"
import { BloomCard } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Card, Link } from "@bloom-housing/ui-seeds"
import styles from "./Assistance.module.scss"
import ContactCard from "../shared/ContactCard"
import Layout from "../../layouts/application"
import { isFeatureFlagOn } from "../../lib/helpers"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import { getStoredContactContent } from "../../static_content/stored_content"

interface AssistanceProps {
  jurisdiction: Jurisdiction
}

const Assistance = (props: AssistanceProps) => {
  const enableFaq = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableFaq)
  const enableHousingBasics = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableHousingBasics
  )
  const enableResources = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableResources)

  const jurisdictionContent = useJurisdictionContent()
  const contact = {
    contactDescription: t("resources.contactDescription"),
    contactInfo: t("resources.contactInfo"),
    email: t("resources.contactEmail"),
    ...getStoredContactContent(jurisdictionContent),
  }

  const showContactCard = contact?.contactDescription || contact?.contactInfo || contact?.email

  return (
    <Layout
      pageTitle={t("pageTitle.getAssistance")}
      metaDescription={t("pageDescription.getAssistance")}
    >
      <PageHeaderLayout
        heading={t("pageTitle.getAssistance")}
        inverse
        subheading={t("pageDescription.getAssistance")}
        className={styles["site-layout"]}
        fullHeight={true}
      >
        <article className={styles["site-content"]}>
          <div className={styles["items-wrapper"]}>
            {enableHousingBasics && (
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
            )}
            {enableFaq && (
              <BloomCard
                title={t("pageTitle.faq")}
                subtitle={t("faq.description")}
                headingPriority={2}
                iconSymbol={"questionMarkCircle"}
                iconOutlined={true}
                variant={"block"}
                className={styles["item"]}
                iconClass="card-icon"
              >
                <Card.Section className={styles["item-link"]}>
                  <Link href={"/faq"}>{t("faq.linkText")}</Link>
                </Card.Section>
              </BloomCard>
            )}
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
          {showContactCard && (
            <aside className={styles["aside-section"]}>
              <ContactCard
                address={contact.address}
                contactDescription={contact.contactDescription}
                contactInfo={contact.contactInfo}
                email={contact.email}
                heading={t("resources.contactTitle")}
                hours={contact.hours}
                phone={contact.phone}
              />
            </aside>
          )}
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Assistance
