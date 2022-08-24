import React from "react"

import { InfoCard } from "../blocks/InfoCard"
import { InfoCardGrid } from "./InfoCardGrid"
import { ExpandableText } from "../actions/ExpandableText"

export default {
  title: "Sections/Info Card Grid",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const ThreeCards = () => (
  <InfoCardGrid
    title="Rentals"
    subtitle="Other rental housing funded by the City, as well as lists developed each month by community nonprofit agencies."
  >
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
    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      {`
#### Header 4

* A list
* of items
      `}
    </InfoCard>

    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }}>
        {`
Text within _another_ component…
      `}
      </ExpandableText>
    </InfoCard>
  </InfoCardGrid>
)
