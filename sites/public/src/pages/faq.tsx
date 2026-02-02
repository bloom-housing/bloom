import React, { useEffect, useContext } from "react"
import Markdown from "markdown-to-jsx"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import { getFaqContent } from "../static_content/generic_faq_content"
import pageStyles from "../components/content-pages/FaqPage.module.scss"
import styles from "../patterns/PageHeaderLayout.module.scss"
import FrequentlyAskedQuestions from "../patterns/FrequentlyAskedQuestions"

const FaqPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FAQ",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const content = getFaqContent()

  return (
    <Layout pageTitle={t("pageTitle.faq")}>
      <PageHeaderLayout
        heading={t("pageTitle.faq")}
        subheading={t("pageDescription.faq")}
        inverse
        className={pageStyles["faq-page"]}
      >
        <div className={styles["markdown"]}>
          {content.categories.map((category, index) => (
            <FrequentlyAskedQuestions key={index} content={{ categories: [category] }} />
          ))}
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
            <Button href={"/additional-resources"}>{t("faq.viewResourcePage")}</Button>
          </Card.Section>
        </Card>
      </PageHeaderLayout>
    </Layout>
  )
}

export default FaqPage
