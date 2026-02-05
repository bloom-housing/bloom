import React, { useEffect, useContext } from "react"
import Markdown from "markdown-to-jsx"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import FrequentlyAskedQuestions from "../patterns/FrequentlyAskedQuestions"
import { getFaqContent } from "../static_content/generic_faq_content"
import pageStyles from "../components/content-pages/FaqPage.module.scss"
import styles from "../patterns/PageHeaderLayout.module.scss"
import { fetchJurisdictionByName } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

const FaqPage = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FAQ",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const content = getFaqContent()

  const enableResources = isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableResources)

  return (
    <Layout pageTitle={t("pageTitle.faq")}>
      <PageHeaderLayout
        heading={t("pageTitle.faq")}
        subheading={t("pageDescription.faq")}
        inverse
        className={pageStyles["faq-page"]}
      >
        <div className={styles["markdown"]}>
          <FrequentlyAskedQuestions content={content} />
        </div>
        <Card className={pageStyles["faq-card"]}>
          <Card.Header>
            <Heading priority={2} size={"xl"}>
              {t("faq.stillHaveQuestions")}
            </Heading>
          </Card.Header>
          <Card.Section>
            <div className={"seeds-m-be-6"}>
              <Markdown>{t("faq.stillHaveQuestionsContent")}</Markdown>
            </div>
            {enableResources && (
              <Button href={"/additional-resources"}>{t("faq.viewResourcePage")}</Button>
            )}
          </Card.Section>
        </Card>
      </PageHeaderLayout>
    </Layout>
  )
}

export default FaqPage

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
