import * as React from "react"
import Markdown from "markdown-to-jsx"
import { t } from "../../../helpers/translator"
import { ExpandableContent } from "../../../actions/ExpandableContent"

interface WhatToExpectProps {
  content: string
  expandableContent: string
}

const WhatToExpect = ({ content, expandableContent }: WhatToExpectProps) => {
  if (!content) return null
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>
      <div className="text-tiny text-gray-750">
        <Markdown options={{ disableParsingRawHTML: false }}>{content}</Markdown>
        {expandableContent && (
          <div className={"mt-2"}>
            <ExpandableContent>
              <Markdown options={{ disableParsingRawHTML: false }}>{expandableContent}</Markdown>
            </ExpandableContent>
          </div>
        )}
      </div>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
