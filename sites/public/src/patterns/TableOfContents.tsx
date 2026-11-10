import React, { useState } from "react"
import ChevronDown from "@heroicons/react/20/solid/ChevronDownIcon"
import ChevronUp from "@heroicons/react/20/solid/ChevronUpIcon"
import { t } from "@bloom-housing/ui-components"
import { Heading, Icon, Link } from "@bloom-housing/ui-seeds"
import { FaqContent, getFaqCategoryId } from "./FrequentlyAskedQuestions"
import styles from "./TableOfContents.module.scss"

interface TableOfContentsProps {
  content: FaqContent
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!content?.categories?.length) return null

  const label = t("faq.tableOfContents.header")
  const listId = "table-of-contents-list"

  return (
    <nav className={styles["table-of-contents"]} aria-label={label}>
      <Heading size={"lg"} className={styles["heading"]}>
        {label}
      </Heading>
      <button
        type={"button"}
        className={styles["toggle-button"]}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        {label}
        <Icon size={"md"} className={styles["toggle-icon"]}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Icon>
      </button>
      <ul id={listId} className={`${styles["links"]} ${isOpen ? styles["links-open"] : ""}`}>
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
