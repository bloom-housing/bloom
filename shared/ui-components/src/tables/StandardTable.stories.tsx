import React from "react"

import { StandardTable } from "./StandardTable"

export default {
  title: "Tables/StandardTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const headers = {
  name: "Name",
  relationship: "Relationship",
  dob: "Date of Birth",
}

const data = [
  {
    name: "Jim Halpert",
    relationship: "Husband",
    dob: "05/01/1985",
  },
  {
    name: "Michael Scott",
    relationship: "Friend",
    dob: "05/01/1975",
  },
]

let i = 50
while (i > 0) {
  data.push(data[0])
  data.push(data[1])
  i--
}

export const Default = () => <StandardTable headers={headers} data={data} />
