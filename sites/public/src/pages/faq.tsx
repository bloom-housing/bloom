import React, { useEffect, useContext, useState } from "react"
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon"
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import { FaqCategory, faqContent } from "../static_content/generic_faq_content"
import pageStyles from "../components/content-pages/FaqPage.module.scss"
import styles from "../patterns/PageHeaderLayout.module.scss"
import Markdown from "markdown-to-jsx"

interface QuestionsProps {
  category: FaqCategory
}

const Questions = (props: QuestionsProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean[]>(props.category.faqs.map(() => false))
  return (
    <div className={pageStyles["questions-container"]}>
      {props.category.faqs.map((faq, faqIndex) => (
        <div className={pageStyles["faq-item-container"]} key={faqIndex}>
          <button
            className={pageStyles["faq-question"]}
            type="button"
            onClick={() => {
              const newExpanded = [...isExpanded]
              newExpanded[faqIndex] = !newExpanded[faqIndex]
              setIsExpanded(newExpanded)
            }}
            aria-expanded={isExpanded[faqIndex]}
            aria-controls={`faq-answer-${faqIndex}`}
            id={`faq-question-${faqIndex}`}
          >
            <div key={faqIndex} className={pageStyles["faq-heading-container"]}>
              <div
                className={`${pageStyles["faq-background"]} ${pageStyles["faq-heading"]} ${
                  isExpanded[faqIndex] ? pageStyles["expanded"] : ""
                }`}
              >
                <Heading priority={3}>{faq.question}</Heading>
                <Icon>{isExpanded[faqIndex] ? <ChevronUpIcon /> : <ChevronDownIcon />}</Icon>
              </div>
            </div>
          </button>
          <div
            id={`faq-answer-${faqIndex}`}
            role={"region"}
            aria-labelledby={`faq-question-${faqIndex}`}
            className={`${pageStyles["faq-background"]} ${pageStyles["faq-answer-container"]} ${
              !isExpanded[faqIndex] ? pageStyles["collapsed"] : pageStyles["content-expanded"]
            }`}
          >
            <div
              className={`${pageStyles["faq-answer"]} ${
                !isExpanded[faqIndex]
                  ? pageStyles["answer-collapsed"]
                  : pageStyles["answer-expanded"]
              }`}
            >
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const FaqPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FAQ",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.faq")}>
      <PageHeaderLayout
        heading={t("pageTitle.faq")}
        subheading={t("pageDescription.faq")}
        inverse
        className={pageStyles["faq-page"]}
      >
        <div className={styles["markdown"]}>
          {faqContent.categories.map((category, index) => (
            <section key={index} className="seeds-m-be-8">
              <Heading priority={2} className={"seeds-m-be-content"}>
                {category.title}
              </Heading>
              <Questions category={category} />
            </section>
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
