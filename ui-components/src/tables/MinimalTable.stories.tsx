import React from "react"

import { MinimalTable } from "./MinimalTable"
import { StandardTableData, TableThumbnail } from "./StandardTable"
import { preferenceData, preferenceHeaders } from "./StandardTable.stories"

export default {
  title: "Tables/MinimalTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: MinimalTable,
}

const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}

const data = [
  {
    name: { content: "Jim Halpert" },
    relationship: { content: "Husband" },
    dob: { content: "05/01/1985" },
  },
  {
    name: { content: "Michael Scott" },
    relationship: { content: "Friend" },
    dob: { content: "05/01/1975" },
  },
]

let i = 50
while (i > 0) {
  data.push(data[0])
  data.push(data[1])
  i--
}

export const Default = () => <MinimalTable headers={headers} data={data} />

export const Responsive = () => (
  <MinimalTable headers={headers} data={data} responsiveCollapse={true} />
)

const headersWithImage = { image: "Image", ...headers }
const dataWithImage = [...data] as StandardTableData
dataWithImage[0].image = {
  content: (
    <TableThumbnail>
      <img src="/images/listing.jpg" alt="listing picture" />
    </TableThumbnail>
  ),
}
dataWithImage[1].image = {
  content: (
    <TableThumbnail>
      <img src="/images/logo_glyph.svg" alt="site logo" />
    </TableThumbnail>
  ),
}

export const ImageCells = () => (
  <MinimalTable
    headers={headersWithImage}
    data={dataWithImage}
    flushLeft={true}
    flushRight={true}
  />
)

export const Draggable = () => (
  <MinimalTable headers={preferenceHeaders} data={preferenceData} draggable={true} />
)

Draggable.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "nested-interactive",
          enabled: false,
        },
      ],
    },
  },
}
