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

describe("<MinimalTable>", () => {
  it("renders without error", () => {
    const { getByText } = render(<MinimalTable headers={headers} data={data} />)
    expect(getByText(data[0].name))
    expect(getByText(data[0].relationship))
    expect(getByText(data[0].dob))
    expect(getByText(data[1].name))
    expect(getByText(data[1].relationship))
    expect(getByText(data[1].dob))
  })

  it("supports flush column styling", () => {
    const { container } = render(
      <MinimalTable headers={headers} data={data} flushLeft flushRight />
    )

    expect(container.querySelector("table.is-flush-left")).toBeTruthy()
    expect(container.querySelector("table.is-flush-right")).toBeTruthy()
  })
})
