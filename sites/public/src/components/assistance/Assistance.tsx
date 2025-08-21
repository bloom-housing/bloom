import Link from "next/link"
import Markdown from "markdown-to-jsx"
import { Card, t } from "@bloom-housing/ui-components"
import { Heading } from "@bloom-housing/ui-seeds"
import { RenderIf } from "../../lib/helpers"
import Layout from "../../layouts/application"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "./Assistance.module.scss"
import { BloomCard } from "@bloom-housing/shared-helpers"

import contactInfo from "../../md_content/resources/contact_info.md"

const Assistance = () => {
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
              title={t("assistance.housingBasicsTitle")}
              subtitle={t("assistance.housingBasicsDescription")}
              headingPriority={2}
              iconSymbol={"questionMarkCircle"}
              iconOutlined={true}
              variant={"block"}
              className={styles["item"]}
              iconClass={styles["item-icon"]}
            >
              <Card.Section className={styles["item-link"]}>
                <Link href={"/housing-basics"}>{t("assistance.housingBasicsLink")}</Link>
              </Card.Section>
            </BloomCard>
            <BloomCard
              title={t("assistance.additionalHousingTitle")}
              subtitle={t("assistance.additionalHousingDescription")}
              headingPriority={2}
              iconSymbol={"home"}
              iconOutlined={true}
              variant={"block"}
              className={styles["item"]}
              iconClass={styles["item-icon"]}
            >
              <Card.Section className={styles["item-link"]}>
                <Link href={"/additional-resources"}>{t("assistance.additionalHousingLink")}</Link>
              </Card.Section>
            </BloomCard>
          </div>
          <aside className={styles["aside-section"]}>
            <Card className={styles["contact-card"]}>
              <div className={styles["contact-card-subsection"]}>
                <Heading size="xl" priority={2}>
                  {t("resources.contactTitle")}
                </Heading>
                <p className={styles["contact-card-info"]}>{t("resources.contactInfo")}</p>
              </div>
              <Markdown
                options={{
                  overrides: {
                    RenderIf,
                  },
                }}
                className={`${styles["contact-card-subsection"]} ${styles["contact-card-description"]}`}
              >
                {contactInfo.toString()}
              </Markdown>
            </Card>
          </aside>
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Assistance
