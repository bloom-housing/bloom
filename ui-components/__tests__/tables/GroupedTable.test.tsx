import React from "react"
import { render, cleanup } from "@testing-library/react"
import { GroupedTable } from "../../src/tables/GroupedTable"

afterEach(cleanup)

export const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}

const data = [
  {
    data: [
      {
        name: "Akane Breckinridge",
        relationship: "Husband",
        dob: "05/01/1985",
      },
      {
        name: "Mirko Kovalchuk",
        relationship: "Friend",
        dob: "05/01/1975",
      },
    ],
  },
  {
    header: "Reserved",
    className: "reserved",
    data: [
      {
        name: "Trixie Fabian",
        relationship: "Partner",
        dob: "06/01/1955",
      },
      {
        name: "Virginia Kirch",
        relationship: "Colleague",
        dob: "12/01/1994",
      },
    ],
  },
]

describe("<GroupedTable>", () => {
  it("renders without error", () => {
    const { getByText } = render(<GroupedTable headers={headers} data={data} />)
    expect(getByText(headers.name)).toBeTruthy()
    expect(getByText(headers.relationship)).toBeTruthy()
    expect(getByText(headers.dob)).toBeTruthy()

    expect(getByText(data[0].data[0].name))
    expect(getByText(data[0].data[0].relationship))
    expect(getByText(data[0].data[0].dob))

    expect(getByText(data[0].data[1].name))
    expect(getByText(data[0].data[1].relationship))
    expect(getByText(data[0].data[1].dob))

    expect(getByText(data[1].data[0].name))
    expect(getByText(data[1].data[0].relationship))
    expect(getByText(data[1].data[0].dob))

    expect(getByText(data[1].data[1].name))
    expect(getByText(data[1].data[1].relationship))
    expect(getByText(data[1].data[1].dob))
  })
})
