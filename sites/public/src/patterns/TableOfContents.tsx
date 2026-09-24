import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Heading, Link } from "@bloom-housing/ui-seeds"
import { FaqContent, getFaqCategoryId } from "./FrequentlyAskedQuestions"
import styles from "./TableOfContents.module.scss"

interface TableOfContentsProps {
  content: FaqContent
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  if (!content?.categories?.length) return null

  return (
    <nav className={styles["table-of-contents"]} aria-label={t("faq.tableOfContents.header")}>
      <Heading size={"lg"} className={styles["heading"]}>
        {t("faq.tableOfContents.header")}
      </Heading>
      <ul className={styles["links"]}>
        {content.categories.map((category, index) => (
          <li key={index} className={styles["link-item"]}>
            <Link href={`#${getFaqCategoryId(index)}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
