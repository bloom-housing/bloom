import React from "react"

import { MinimalTable } from "./MinimalTable"
import { StandardTableData, TableThumbnail } from "./StandardTable"
import { preferenceData, preferenceHeaders, mockData, mockHeaders } from "./StandardTable.stories"

export default {
  title: "Tables/MinimalTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: MinimalTable,
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
