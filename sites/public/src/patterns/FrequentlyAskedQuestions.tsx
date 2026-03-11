import React, { useState } from "react"
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon"
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon"
import { Heading, Icon } from "@bloom-housing/ui-seeds"
import styles from "./FrequentlyAskedQuestions.module.scss"

export type FaqPageItem = {
  question: React.ReactNode | string
  answer: React.ReactNode | string
}

export type FaqCategory = {
  title: React.ReactNode
  faqs: FaqPageItem[]
}

export type FaqContent = {
  categories: FaqCategory[]
}

interface QuestionsProps {
  category: FaqCategory
}

export const Questions = (props: QuestionsProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean[]>(props.category.faqs.map(() => false))
  return (
    <div className={styles["questions-container"]}>
      {props.category.faqs.map((faq, faqIndex) => (
        <div className={styles["faq-item-container"]} key={faqIndex}>
          <button
            className={styles["faq-question"]}
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
            <div key={faqIndex} className={styles["faq-heading-container"]}>
              <div
                className={`${styles["faq-background"]} ${styles["faq-heading"]} ${
                  isExpanded[faqIndex] ? styles["expanded"] : ""
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
            className={`${styles["faq-background"]} ${styles["faq-answer-container"]} ${
              !isExpanded[faqIndex] ? styles["collapsed"] : styles["content-expanded"]
            }`}
          >
            <div
              className={`${styles["faq-answer"]} ${
                !isExpanded[faqIndex] ? styles["answer-collapsed"] : styles["answer-expanded"]
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

interface FrequentlyAskedQuestionsProps {
  content: FaqContent
}

const FrequentlyAskedQuestions = (props: FrequentlyAskedQuestionsProps) => {
  return (
    <div className={styles["faq-container"]}>
      {props.content.categories.map((category, index) => (
        <section key={index} className="seeds-m-be-8">
          <Heading priority={2} className={"seeds-m-be-content"}>
            {category.title}
          </Heading>
          <Questions category={category} />
        </section>
      ))}
    </div>
  )
}

export default FrequentlyAskedQuestions
