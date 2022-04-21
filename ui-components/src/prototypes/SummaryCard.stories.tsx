import React from "react"
import { mockData, mockHeaders } from "../tables/StandardTable.stories"
import { MinimalTable } from "../tables/MinimalTable"

import "./SummaryCard.scss"

export default {
  title: "Prototypes/SummaryCard",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const SummaryCard = () => (
  <div className="summary-card">
    <header className="summary-card__header">
      <h2 className="summary-card__title">
        <a href="#">My Property</a>
      </h2>
    </header>
    <MinimalTable headers={mockHeaders} data={mockData} />
  </div>
)

export const SummaryCardHeading = () => (
  <div className="summary-card">
    <header className="summary-card__header bg-gray-100 border-b mb-2">
      <h2 className="summary-card__title">
        <a href="#">My Property</a>
      </h2>
      <p className="text-sm mt-3">
        <span>1 Polk St, San Francisco, CA 94102</span>
        <span className="ml-4 pl-4 border-l border-gray-600">Waitlist: 353</span>
      </p>
    </header>
    <MinimalTable headers={mockHeaders} data={mockData} />
  </div>
)
