import React from "react"

import { TableCard } from "./TableCard"
import { MinimalTable } from "./MinimalTable"
import { mockData, mockHeaders } from "./StandardTable.stories"

export default {
  title: "Tables/TableCard",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: TableCard,
}

export const Blank = () => <TableCard title="Table Card Title" elementsQty={0} onAddClick={() => console.log('click')} />

export const WithTable = () => (
  <TableCard title="Table Card Title" elementsQty={3} onAddClick={() => console.log('click')}>
    <div className="px-3">
      <MinimalTable headers={mockHeaders} data={mockData} />
    </div>
  </TableCard>
)
