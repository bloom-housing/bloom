import React from "react"
import { BADGES } from "../../.storybook/constants"
import { InfoCard } from "../blocks/InfoCard"
import { ExpandableText } from "../actions/ExpandableText"
import InfoCardDocumentation from "./InfoCard.docs.mdx"

export default {
  title: "blocks/Info Card  🚩",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  id: "blocks/info-card",
  parameters: {
    docs: {
      page: InfoCardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const Default = () => (
  <>
    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      {`
Paragraph content

----

More content
      `}
    </InfoCard>
  </>
)

export const WithMarkdown = () => (
  <InfoCard title="My Card" externalHref="http://google.com" className="is-normal-primary-lighter">
    {`
#### Header 4

* A list
* of items
      `}
  </InfoCard>
)

export const WithChildComponent = () => (
  <InfoCard title="My Card" externalHref="http://google.com" className="is-normal-primary-lighter">
    <ExpandableText strings={{ readMore: "More", readLess: "Less" }}>
      {`
Text within _another_ component…
      `}
    </ExpandableText>
  </InfoCard>
)
