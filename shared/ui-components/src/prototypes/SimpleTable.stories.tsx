import React from "react"

import { SimpleTable } from "./SimpleTable"

export default {
  title: "Prototypes/SimpleTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <SimpleTable />
