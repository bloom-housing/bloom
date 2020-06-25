import * as React from "react"
import "./MarkdownSection.scss"

export interface MarkdownSectionProps {
  fullwidth?: boolean
  children: JSX.Element
}

export const MarkdownSection = (props: MarkdownSectionProps) => {
  const contentWidth = props.fullwidth ? "markdown" : "markdown max-w-2xl"

  return (
    <div className="markdown-section">
      <div className="markdown-section__inner">
        <article className={contentWidth}>{props.children}</article>
      </div>
    </div>
  )
}

export default MarkdownSection
