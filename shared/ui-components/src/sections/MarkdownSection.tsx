import * as React from "react"

export interface MarkdownSectionProps {
  fullwidth?: boolean
  children: JSX.Element
}

export const MarkdownSection = (props: MarkdownSectionProps) => {
  const contentWidth = props.fullwidth ? "markdown" : "markdown max-w-2xl"

  return (
    <div className="px-5 mt-10 my-20">
      <div className="max-w-5xl m-auto">
        <article className={contentWidth}>{props.children}</article>
      </div>
    </div>
  )
}

export default MarkdownSection
