import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StandardTable } from "../../src/tables/StandardTable"
import { t } from "../../src/helpers/translator"

afterEach(cleanup)

const headers = {
  number: "t.unit",
  sqFeet: "t.area",
  numBathrooms: "listings.bath",
}

const data = [
  {
    number: "100",
    sqFeet: "800",
    numBathrooms: "2",
  },
  {
    number: "101",
    sqFeet: "850",
    numBathrooms: "3",
  },
]

describe("<StandardTable>", () => {
  it("renders default state", () => {
    const { getByText } = render(<StandardTable headers={headers} data={data} />)
    expect(getByText(data[0].number))
    expect(getByText(data[0].sqFeet))
    expect(getByText(data[0].numBathrooms))
    expect(getByText(data[1].number))
    expect(getByText(data[1].sqFeet))
    expect(getByText(data[1].numBathrooms))
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
    expect(getByText(data[0].number))
    expect(getByText(data[0].sqFeet))
    expect(getByText(data[0].numBathrooms))
    expect(getByText(data[1].number))
    expect(getByText(data[1].sqFeet))
    expect(getByText(data[1].numBathrooms))
    expect(container.getElementsByClassName("table-class").length).toBe(1)
    expect(container.getElementsByClassName("cell-class").length).toBe(6)
  })
})
