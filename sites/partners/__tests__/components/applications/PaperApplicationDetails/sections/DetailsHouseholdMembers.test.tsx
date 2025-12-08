/* eslint-disable import/no-named-as-default */
import React from "react"
import { mockNextRouter, render, within } from "../../../../testUtils"
import DetailsHouseholdMembers from "../../../../../src/components/applications/PaperApplicationDetails/sections/DetailsHouseholdMembers"
import { application, householdMember } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ApplicationContext } from "../../../../../src/components/applications/ApplicationContext"

describe("DetailsHouseholdMembers", () => {
  mockNextRouter({ id: "application_1" })

  it("should display Houshold Members section table", () => {
    const { getByRole, queryByText } = render(
      <ApplicationContext.Provider value={application}>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <DetailsHouseholdMembers setMembersDrawer={() => {}} />
      </ApplicationContext.Provider>
    )

    // Check the section header
    expect(getByRole("heading", { name: "Household members" })).toBeInTheDocument()

    // Get the table and check headers
    const table = getByRole("table")
    const tableHeaders = within(table).getAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(6)

    const [name, dob, relationship, residence, work, actions] = tableHeaders
    expect(name).toHaveTextContent(/name/i)
    expect(dob).toHaveTextContent(/date of birth/i)
    expect(relationship).toHaveTextContent(/relationship/i)
    expect(residence).toHaveTextContent(/same residence/i)
    expect(work).toHaveTextContent(/work in region/i)
    expect(actions).toHaveTextContent(/actions/i)

    // Check table body rows
    const tableBodyRows = within(table).getAllByRole("row")
    expect(tableBodyRows).toHaveLength(2) // 1 for the header row + 1 for the Household member row

    const [nameVal, dobVal, relationshipVal, residenceVal, workVal, actionsVal] = within(
      tableBodyRows[1]
    ).getAllByRole("cell")

    expect(nameVal).toHaveTextContent("Household First Household Last")
    expect(dobVal).toHaveTextContent("11/25/1966")
    expect(relationshipVal).toHaveTextContent("Friend")
    expect(residenceVal).toHaveTextContent("No")
    expect(workVal).toHaveTextContent("Yes")
    expect(within(actionsVal).getByText("View")).toBeInTheDocument()

    expect(queryByText("Full-time student")).not.toBeInTheDocument()
  })

  it("should display Houshold Members section table with full time student question", () => {
    const { getByRole } = render(
      <ApplicationContext.Provider value={application}>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <DetailsHouseholdMembers setMembersDrawer={() => {}} enableFullTimeStudentQuestion={true} />
      </ApplicationContext.Provider>
    )

    // Check the section header
    expect(getByRole("heading", { name: "Household members" })).toBeInTheDocument()

    // Get the table and check headers
    const table = getByRole("table")
    const tableHeaders = within(table).getAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(7)

    const [name, dob, relationship, residence, work, student, actions] = tableHeaders
    expect(name).toHaveTextContent(/name/i)
    expect(dob).toHaveTextContent(/date of birth/i)
    expect(relationship).toHaveTextContent(/relationship/i)
    expect(residence).toHaveTextContent(/same residence/i)
    expect(work).toHaveTextContent(/work in region/i)
    expect(student).toHaveTextContent("Full-time student")
    expect(actions).toHaveTextContent(/actions/i)

    // Check table body rows
    const tableBodyRows = within(table).getAllByRole("row")
    expect(tableBodyRows).toHaveLength(2) // 1 for the header row + 1 for the Household member row

    const [nameVal, dobVal, relationshipVal, residenceVal, workVal, studentVal, actionsVal] =
      within(tableBodyRows[1]).getAllByRole("cell")

    expect(nameVal).toHaveTextContent("Household First Household Last")
    expect(dobVal).toHaveTextContent("11/25/1966")
    expect(relationshipVal).toHaveTextContent("Friend")
    expect(residenceVal).toHaveTextContent("No")
    expect(workVal).toHaveTextContent("Yes")
    expect(studentVal).toHaveTextContent("No")
    expect(within(actionsVal).getByText("View")).toBeInTheDocument()
  })

  it("should display Houshold Members section table with disableWorkInRegion", () => {
    const { getByRole } = render(
      <ApplicationContext.Provider value={application}>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <DetailsHouseholdMembers setMembersDrawer={() => {}} disableWorkInRegion={true} />
      </ApplicationContext.Provider>
    )

    // Check the section header
    expect(getByRole("heading", { name: "Household members" })).toBeInTheDocument()

    // Get the table and check headers
    const table = getByRole("table")
    const tableHeaders = within(table).getAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(5)

    const [name, dob, relationship, residence, actions] = tableHeaders
    expect(name).toHaveTextContent(/name/i)
    expect(dob).toHaveTextContent(/date of birth/i)
    expect(relationship).toHaveTextContent(/relationship/i)
    expect(residence).toHaveTextContent(/same residence/i)
    expect(actions).toHaveTextContent(/actions/i)
  })

  it("should display name as n/a", () => {
    const { getByRole } = render(
      <ApplicationContext.Provider
        value={{
          ...application,
          householdMember: [
            householdMember,
            { ...householdMember, firstName: null, lastName: null, middleName: null },
            { ...householdMember, firstName: null, lastName: "Last", middleName: null },
            { ...householdMember, firstName: "First", lastName: null, middleName: null },
            { ...householdMember, firstName: null, lastName: null, middleName: "middle" },
          ],
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <DetailsHouseholdMembers setMembersDrawer={() => {}} enableFullTimeStudentQuestion={true} />
      </ApplicationContext.Provider>
    )

    // Get the table and check headers
    const table = getByRole("table")

    // Check table body rows
    const tableBodyRows = within(table).getAllByRole("row")

    expect(within(tableBodyRows[1]).getAllByRole("cell")[0]).toHaveTextContent(
      "Household First Household Last"
    )
    expect(within(tableBodyRows[2]).getAllByRole("cell")[0]).toHaveTextContent("n/a")
    expect(within(tableBodyRows[3]).getAllByRole("cell")[0]).toHaveTextContent("Last")
    expect(within(tableBodyRows[4]).getAllByRole("cell")[0]).toHaveTextContent("First")
    expect(within(tableBodyRows[5]).getAllByRole("cell")[0]).toHaveTextContent("middle")
  })
})
