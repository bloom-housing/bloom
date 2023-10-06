import React from "react"

import { MinimalTable } from "./MinimalTable"
import { preferenceData, preferenceHeaders, mockData, mockHeaders } from "./StandardTable.stories"
import { TableHeaders, StandardTableData, TableThumbnail } from "@bloom-housing/ui-components"
import Icon, { IconFillColors } from "../icons/Icon"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"

export default {
  title: "Tables/MinimalTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: MinimalTable,
  excludeStories: ["mockHeadersWithStyling", "mockDataWithStyling"],
}

export const Default = () => <MinimalTable headers={mockHeaders} data={mockData} />

export const Responsive = () => (
  <MinimalTable headers={mockHeaders} data={mockData} responsiveCollapse={true} />
)

const headersWithImage = { image: "Image", ...mockHeaders }
const dataWithImage = [...mockData] as StandardTableData
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

export const ImageCells = () => <MinimalTable headers={headersWithImage} data={dataWithImage} />

export const FlushLeft = () => (
  <MinimalTable headers={headersWithImage} data={dataWithImage} flushLeft={true} />
)

export const FlushRight = () => (
  <MinimalTable headers={headersWithImage} data={dataWithImage} flushRight={true} />
)

export const Draggable = () => (
  <MinimalTable headers={preferenceHeaders} data={preferenceData} draggable={true} />
)

export const mockHeadersWithStyling: TableHeaders = {
  name: { name: "t.name" },
  relationship: { name: "t.relationship" },
  dob: {
    name: "application.household.member.dateOfBirth",
  },
  icons: { name: "" },
}

const iconContent = () => {
  return (
    <div className={"flex justify-end"}>
      <div className={"w-max"}>
        <span onClick={() => alert("edit")} className={"cursor-pointer"}>
          <Icon
            symbol={faPenToSquare}
            size={"medium"}
            fill={IconFillColors.primary}
            className={"mr-5"}
          />
        </span>
        <span onClick={() => alert("copy")} className={"cursor-pointer"}>
          <Icon symbol={faClone} size={"medium"} fill={IconFillColors.primary} className={"mr-5"} />
        </span>
        <span onClick={() => alert("trash")} className={"cursor-pointer"}>
          <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
        </span>
      </div>
    </div>
  )
}

export const mockDataWithStyling: StandardTableData = [
  {
    name: { content: "Jim Halpert" },
    relationship: { content: "Husband" },
    dob: { content: "05/01/1985" },
    icons: { content: iconContent() },
  },
  {
    name: { content: "Michael Scott" },
    relationship: { content: "Friend" },
    dob: { content: "05/01/1975" },
    icons: { content: iconContent() },
  },
]

let i = 5
while (i > 0) {
  mockDataWithStyling.push(mockDataWithStyling[0])
  mockDataWithStyling.push(mockDataWithStyling[1])
  i--
}

export const withIcons = () => (
  <MinimalTable headers={mockHeadersWithStyling} data={mockDataWithStyling} draggable={true} />
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
