import React from "react"
import { Button } from "../actions/Button"
import { StandardTable, TableThumbnail } from "./StandardTable"

export default {
  title: "Tables/StandardTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  includeStories: ["Default", "ImageCells", "Draggable"],
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

export const Default = () => <StandardTable headers={headers} data={data} />

const headersWithImage = { image: "Image", ...headers }
const dataWithImage = [...data] as any
dataWithImage[0].image = (
  <TableThumbnail>
    <a href="#">
      <img src="/images/listing.jpg" alt="listing image" />
    </a>
  </TableThumbnail>
)
dataWithImage[1].image = (
  <TableThumbnail>
    <img src="/images/logo_glyph.svg" alt="logo" />
  </TableThumbnail>
)

export const ImageCells = () => (
  <StandardTable headers={headersWithImage} data={dataWithImage} responsiveCollapse />
)

export const preferenceHeaders = {
  name: "t.name",
  action: "",
}

const getDeleteButton = () => {
  return (
    <div className={"text-right"}>
      <Button type="button" className="front-semibold uppercase text-red-700 m-0" unstyled>
        Delete
      </Button>
    </div>
  )
}

export const preferenceData = [
  {
    name: "Live or Work in City of Hayward",
    action: getDeleteButton(),
  },
  {
    name: "Displacee Tenant",
    action: getDeleteButton(),
  },
  {
    name: "Veteran Status",
    action: getDeleteButton(),
  },
]

export const Draggable = () => (
  <StandardTable headers={preferenceHeaders} data={preferenceData} draggable={true} />
)
