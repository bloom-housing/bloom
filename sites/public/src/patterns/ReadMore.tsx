import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import { t } from "@bloom-housing/ui-components"
import styles from "./ReadMore.module.scss"

interface ReadMoreProps {
  /** Full content to display */
  content?: string
  /** Maximum number of characters that will appear before truncating */
  maxLength?: number
  /** Length a string must surpass over maxLength for truncation to occur */
  offset?: number
  /** Default state for expanded, otherwise set to false */
  expanded?: boolean
  /** If passed, all of the main content is displayed and truncation happens at the start of this content */
  truncatedContent?: string
}

export const ReadMore = (props: ReadMoreProps) => {
  const DEFAULT_MAX_LENGTH = 450
  const DEFAULT_OFFSET = 25
  const computedMaxLength = props.maxLength ?? DEFAULT_MAX_LENGTH
  const computedDefaultOffset = props.offset ?? DEFAULT_OFFSET

  const [expanded, setExpanded] = useState(props.expanded || false)
  // Should only truncate if there would be > computedDefaultOffset characters after the ellipsis, so that you don't expand to see only an oddly few number of additional characters
  const shouldTruncate =
    props.truncatedContent || props.content.length > computedMaxLength + computedDefaultOffset

  // Clips at the end of the nearest word after the max length, instead of in the middle of a word
  const truncatedIndex = props.content.indexOf(" ", computedMaxLength)

  const contentTruncated =
    shouldTruncate && !props.truncatedContent
      ? props.content.slice(0, truncatedIndex).concat(" ...")
      : props.content

  return (
    <div className={styles["read-more"]} aria-live={"polite"}>
      <Markdown id={"read-more-content"} className={"bloom-markdown"}>
        {expanded
          ? props.content.concat(props.truncatedContent ? ` ${props.truncatedContent}` : "")
          : contentTruncated}
      </Markdown>
      {shouldTruncate && (
        <button
          className={`${styles["read-more-button"]} seeds-m-bs-text`}
          onClick={() => {
            setExpanded(!expanded)
          }}
          aria-label={t("t.readMore")}
          aria-expanded={expanded}
          aria-controls={"read-more-content"}
        >
          {expanded ? t("t.readLess") : t("t.readMore")}
        </button>
      )}
    </div>
  )
}
