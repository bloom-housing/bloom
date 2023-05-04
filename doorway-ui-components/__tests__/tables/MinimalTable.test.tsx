import React from "react"
import { render, cleanup } from "@testing-library/react"
import { MinimalTable } from "../../src/tables/MinimalTable"

afterEach(cleanup)

const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}

const data = [
  {
    name: { content: "Virginia Kirch" },
    relationship: { content: "Colleague" },
    dob: { content: "12/01/1994" },
  },
  {
    name: { content: "Trixie Fabian" },
    relationship: { content: "Partner" },
    dob: { content: "06/01/1955" },
  },
]

describe("<MinimalTable>", () => {
  it("renders without error", () => {
    const { getByText } = render(<MinimalTable headers={headers} data={data} />)
    expect(getByText(data[0].name.content))
    expect(getByText(data[0].relationship.content))
    expect(getByText(data[0].dob.content))
    expect(getByText(data[1].name.content))
    expect(getByText(data[1].relationship.content))
    expect(getByText(data[1].dob.content))
  })

  it("supports flush column styling", () => {
    const { container } = render(
      <MinimalTable headers={headers} data={data} flushLeft flushRight />
    )

    expect(container.querySelector("table.is-flush-left")).toBeTruthy()
    expect(container.querySelector("table.is-flush-right")).toBeTruthy()
  })
})
