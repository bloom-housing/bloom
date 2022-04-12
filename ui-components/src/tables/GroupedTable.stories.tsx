import React from "react"

import { GroupedTable } from "./GroupedTable"
import { mockData, mockHeaders } from "../tables/StandardTable.stories"

export default {
  title: "Tables/GroupedTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const data = [
  {
    header: "Reserved",
    className: "reserved",
    data: mockData,
  },
  {
    data: mockData,
  },
]

export const Default = () => <GroupedTable headers={mockHeaders} data={data} />
