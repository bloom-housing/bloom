import React from "react"

import { GroupedTable } from "./GroupedTable"

export default {
  title: "Tables/GroupedTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}
const data = [
  {
    data: [
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
    ],
  },
  {
    header: "Reserved",
    className: "reserved",
    data: [
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
    ],
  },
]

export const Default = () => <GroupedTable headers={headers} data={data} />
