import Head from "next/head"
import Layout from "../../layouts/application"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import { Card, t } from "@bloom-housing/ui-components"
import AssistanceItem from "./AssistanceItem"
import { Heading } from "@bloom-housing/ui-seeds"
import Link from "next/link"
import styles from "./Assistance.module.scss"

const Assistance = () => {
  const pageTitle = t("pageTitle.getAssistance")
  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PageHeaderLayout
        heading={pageTitle}
        inverse
        subheading={t("pageDescription.getAssistance")}
        className={styles["site-layout"]}
      >
        <article className={styles["site-content"]}>
          <div className={styles["items-wrapper"]}>
            <AssistanceItem
              iconSymbol="home"
              title={t("assistance.applyToHousingTitle")}
              description={t("assistance.applyToHousingDescription")}
              linkText={t("assistance.applyToHousingLink")}
              href="/how-it-works"
            />
            <AssistanceItem
              iconSymbol="door"
              title={t("assistance.additionalHousingTitle")}
              description={t("assistance.additionalHousingDescription")}
              linkText={t("assistance.additionalHousingLink")}
              href="test"
            />
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
