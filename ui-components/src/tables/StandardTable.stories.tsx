import React from "react"
import { Button } from "../actions/Button"
import { StandardTable, StandardTableData, TableHeaders, TableThumbnail } from "./StandardTable"

export default {
  title: "Tables/StandardTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  includeStories: ["Default", "ImageCells", "Draggable"],
  excludeStories: ["mockHeaders", "mockData", "preferenceHeaders", "preferenceData"],
  component: StandardTable,
}

export const mockHeaders: TableHeaders = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}

export const mockData: StandardTableData = [
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

let i = 5
while (i > 0) {
  mockData.push(mockData[0])
  mockData.push(mockData[1])
  i--
}

export const Default = () => <StandardTable headers={mockHeaders} data={mockData} />

const headersWithImage = { image: "Image", ...mockHeaders }
const dataWithImage = [...mockData] as any
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
    name: { content: "Live or Work in City of Hayward" },
    action: { content: getDeleteButton() },
  },
  {
    name: { content: "Displacee Tenant" },
    action: { content: getDeleteButton() },
  },
  {
    name: { content: "Veteran Status" },
    action: { content: getDeleteButton() },
  },
]

export const Draggable = () => (
  <StandardTable headers={preferenceHeaders} data={preferenceData} draggable={true} />
)

Draggable.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "nested-interactive",
          enabled: false,
        },
        {
          id: "color-contrast",
          enabled: false,
        },
      ],
    },
  },
}
