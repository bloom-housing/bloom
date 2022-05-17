import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StandardTable, StandardTableData, TableThumbnail } from "../../src/tables/StandardTable"

afterEach(cleanup)

const headers = {
  number: "t.unit",
  sqFeet: "t.area",
  numBathrooms: "listings.bath",
}

const data = [
  {
    number: { content: "100" },
    sqFeet: { content: "800" },
    numBathrooms: { content: "2" },
  },
  {
    number: { content: "101" },
    sqFeet: { content: "850" },
    numBathrooms: { content: "3" },
  },
]

const headersWithImage = { image: "t.text", ...headers }
const dataWithImage: StandardTableData = [...data]
dataWithImage[0].image = {
  content: (
    <TableThumbnail>
      <img src="/images/listing.jpg" />
    </TableThumbnail>
  ),
}
dataWithImage[1].image = {
  content: (
    <TableThumbnail>
      <img src="/images/logo_glyph.svg" />
    </TableThumbnail>
  ),
}

describe("<StandardTable>", () => {
  it("renders default state", () => {
    const { getByText } = render(<StandardTable headers={headers} data={data} />)
    expect(getByText(data[0].number.content))
    expect(getByText(data[0].sqFeet.content))
    expect(getByText(data[0].numBathrooms.content))
    expect(getByText(data[1].number.content))
    expect(getByText(data[1].sqFeet.content))
    expect(getByText(data[1].numBathrooms.content))
  })

  it("renders with image thumbnails", () => {
    const { container } = render(<StandardTable headers={headersWithImage} data={dataWithImage} />)
    expect(container.getElementsByClassName("table__thumbnail").length).toBe(2)
  })

  it("renders with custom props", () => {
    const { getByText, container } = render(
      <StandardTable
        headers={headers}
        data={data}
        tableClassName={"table-class"}
        cellClassName={"cell-class"}
        responsiveCollapse={true}
      />
    )
    expect(getByText(data[0].number.content))
    expect(getByText(data[0].sqFeet.content))
    expect(getByText(data[0].numBathrooms.content))
    expect(getByText(data[1].number.content))
    expect(getByText(data[1].sqFeet.content))
    expect(getByText(data[1].numBathrooms.content))
    expect(container.getElementsByClassName("table-class").length).toBe(1)
    expect(container.getElementsByClassName("cell-class").length).toBe(6)
  })
})
