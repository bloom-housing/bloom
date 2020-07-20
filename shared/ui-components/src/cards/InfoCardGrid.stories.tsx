import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import InfoCard from "./InfoCard"
import InfoCardGrid from "./InfoCardGrid"
import ExpandableText from "../atoms/ExpandableText"

export default {
  title: "Cards|InfoCardGrid",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const ThreeColumns = () => (
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
### Header 3

* A list
* of items
      `}
    </InfoCard>

    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      <ExpandableText>
        {`
Text within _another_ component…
      `}
      </ExpandableText>
    </InfoCard>
  </InfoCardGrid>
)
