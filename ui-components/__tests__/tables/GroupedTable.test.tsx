import React from "react"
import { render, cleanup } from "@testing-library/react"
import { GroupedTable } from "../../src/tables/GroupedTable"
import { t } from "../../src/helpers/translator"

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
        name: { content: "Akane Breckinridge" },
        relationship: { content: "Husband" },
        dob: { content: "05/01/1985" },
      },
      {
        name: { content: "Mirko Kovalchuk" },
        relationship: { content: "Friend" },
        dob: { content: "05/01/1975" },
      },
    ],
  },
  {
    header: "Reserved",
    className: "reserved",
    data: [
      {
        name: { content: "Trixie Fabian" },
        relationship: { content: "Partner" },
        dob: { content: "06/01/1955" },
      },
      {
        name: { content: "Virginia Kirch" },
        relationship: { content: "Colleague" },
        dob: { content: "12/01/1994" },
      },
    ],
  },
]

describe("<GroupedTable>", () => {
  it("renders without error", () => {
    const { getByText } = render(<GroupedTable headers={headers} data={data} />)
    expect(getByText(t(headers.name))).toBeTruthy()
    expect(getByText(t(headers.relationship))).toBeTruthy()
    expect(getByText(t(headers.dob))).toBeTruthy()

    expect(getByText(data[0].data[0].name.content))
    expect(getByText(data[0].data[0].relationship.content))
    expect(getByText(data[0].data[0].dob.content))

    expect(getByText(data[0].data[1].name.content))
    expect(getByText(data[0].data[1].relationship.content))
    expect(getByText(data[0].data[1].dob.content))

    expect(getByText(data[1].data[0].name.content))
    expect(getByText(data[1].data[0].relationship.content))
    expect(getByText(data[1].data[0].dob.content))

    expect(getByText(data[1].data[1].name.content))
    expect(getByText(data[1].data[1].relationship.content))
    expect(getByText(data[1].data[1].dob.content))
  })
})
