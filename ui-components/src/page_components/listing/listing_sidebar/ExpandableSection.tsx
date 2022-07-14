import * as React from "react"
import Markdown from "markdown-to-jsx"
import { ExpandableContent } from "../../../actions/ExpandableContent"

export interface ExpandableSectionProps {
  content: string | React.ReactNode
  expandableContent?: string
  strings: {
    title: string
    readMore?: string
    readLess?: string
  }
}

const ExpandableSection = ({ content, expandableContent, strings }: ExpandableSectionProps) => {
  if (!content) return null
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{strings.title}</h4>
      <div className="text-tiny text-gray-750">
        {typeof content === "string" ? (
          <Markdown options={{ disableParsingRawHTML: false }}>{content}</Markdown>
        ) : (
          content
        )}
        {expandableContent && (
          <div className={"mt-2"}>
            <ExpandableContent strings={{ readMore: strings.readMore, readLess: strings.readLess }}>
              <Markdown options={{ disableParsingRawHTML: false }}>{expandableContent}</Markdown>
            </ExpandableContent>
          </div>
        )}
      </div>
    </section>
  )
}

export { ExpandableSection as default, ExpandableSection }
