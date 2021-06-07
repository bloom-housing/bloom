import React from "react"

import { MinimalTable } from "./MinimalTable"

export default {
  title: "Tables/MinimalTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
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

export const Default = () => <MinimalTable headers={headers} data={data} />

const headersWithImage = { image: "Image", ...headers }
const dataWithImage = [...data] as any
dataWithImage[0].image = <img src="/images/listing.jpg" />
dataWithImage[1].image = <img src="/images/logo_glyph.svg" />

export const ImageCells = () => (
  <MinimalTable
    headers={headersWithImage}
    data={dataWithImage}
    flushLeft={true}
    flushRight={true}
  />
)
