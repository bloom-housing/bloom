import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./InfoCardGrid.scss"
import InfoCard from "../cards/InfoCard"

export default {
  title: "Prototypes|InfoCardGrid",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const TwoColumns = () => (
  <section className="info-cards">
    <header className="info-cards__header">
      <h2 className="info-cards__title">Rentals</h2>
      <p className="info-cards__subtitle">Other rental housing funded by the City, as well as lists developed each month by community nonprofit agencies.</p>
    </header>
    <div className="info-cards__grid">
      <InfoCard 
        title="My Card"
        externalHref="http//google.com"
        style="is-normal-primary-lighter">
        <p>My content</p>
      </InfoCard>
      <InfoCard 
        title="My Card"
        externalHref="http//google.com"
        style="is-normal-primary-lighter">
        <p>My content</p>
      </InfoCard>
    </div>
  </section>
)