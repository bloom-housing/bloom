import React from "react"

import { StandardCard } from "./StandardCard"
import { MinimalTable } from "../tables/MinimalTable"
import { Button } from "../actions/Button"
import { mockData, mockHeaders } from "../tables/StandardTable.stories"

export default {
  title: "Tables/StandardCard",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: StandardCard,
}

export const Blank = () => (
  <StandardCard title="Table Card Title" emptyStateMessage="Add items to edit" footer={<Button>Add item</Button>}  />
)

export const WithTable = () => (
  <StandardCard title="Table Card Title" emptyStateMessage="Add items to edit" footer={<Button>Add item</Button>}>
    <div className="px-3">
      <MinimalTable headers={mockHeaders} data={mockData} />
    </div>
  </StandardCard>
)