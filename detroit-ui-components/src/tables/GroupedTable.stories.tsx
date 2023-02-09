import React from "react"

import { GroupedTable } from "./GroupedTable"
import { mockData } from "../tables/StandardTable.stories"
import { t } from "@bloom-housing/ui-components"

export default {
  title: "Tables/GroupedTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const headers = {
  name: t("t.name"),
  relationship: t("t.relationship"),
  dob: t("application.household.member.dateOfBirth"),
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

export const Default = () => <GroupedTable headers={headers} data={data} />
