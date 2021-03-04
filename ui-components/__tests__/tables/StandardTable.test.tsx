import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StandardTable } from "../../src/tables/StandardTable"

afterEach(cleanup)

const headers = {
  name: "Name",
  relationship: "Relationship",
  dob: "Date of Birth",
}

const data = [
  {
    name: "Virginia Kirch",
    relationship: "Colleague",
    dob: "12/01/1994",
  },
  {
    name: "Trixie Fabian",
    relationship: "Partner",
    dob: "06/01/1955",
  },
]

describe("<StandardTable>", () => {
  it("renders default state", () => {
    const { getByText } = render(<StandardTable headers={headers} data={data} />)
    expect(getByText(data[0].name))
    expect(getByText(data[0].relationship))
    expect(getByText(data[0].dob))
    expect(getByText(data[1].name))
    expect(getByText(data[1].relationship))
    expect(getByText(data[1].dob))
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
    expect(getByText(data[0].name))
    expect(getByText(data[0].relationship))
    expect(getByText(data[0].dob))
    expect(getByText(data[1].name))
    expect(getByText(data[1].relationship))
    expect(getByText(data[1].dob))
    expect(container.getElementsByClassName("table-class").length).toBe(1)
    expect(container.getElementsByClassName("cell-class").length).toBe(6)
  })
})
