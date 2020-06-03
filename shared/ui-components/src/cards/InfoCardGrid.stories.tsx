import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import InfoCard from "./InfoCard"
import InfoCardGrid from "./InfoCardGrid"

export default {
  title: "Cards|InfoCardGrid",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const TwoColumns = () => (
  <InfoCardGrid
    title="Rentals"
    subtitle="Other rental housing funded by the City, as well as lists developed each month by community nonprofit agencies."
  >
    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      <p>My content</p>
    </InfoCard>
    <InfoCard
      title="My Card"
      externalHref="http://google.com"
      className="is-normal-primary-lighter"
    >
      <p>My content</p>
    </InfoCard>
  </InfoCardGrid>
)
