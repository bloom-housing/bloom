import React from "react"
import { SimpleTable } from "./SimpleTable"

import "./PropertyCard.scss"

export default {
  title: "Prototypes/PropertyCard",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const PropertyCard = () => (
  <div className="property-card">
    <header className="property-card__header">
      <h2 className="property-card__title"><a href="#">My Property</a></h2>
    </header>
    <SimpleTable />
  </div>
)

export const PropertyCardHeading = () => (
  <div className="property-card">
    <header className="property-card__header bg-gray-100 border-b mb-2">
      <h2 className="property-card__title"><a href="#">My Property</a></h2>
      <p className="text-sm mt-3"><span>1 Polk St, San Francisco, CA 94102</span><span className="ml-4 pl-4 border-l border-gray-600">Waitlist: 353</span></p>
    </header>
    <SimpleTable />
  </div>
)