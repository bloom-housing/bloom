import React from "react"
import { FormProviderWrapper } from "./helpers"
import { FormHouseholdMembers } from "../../../../src/components/applications/PaperApplicationForm/sections/FormHouseholdMembers"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import {
  HouseholdMemberRelationship,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const mockHouseholdMember = {
  id: "member_1_id",
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: "John",
  middleName: "Mark",
  lastName: "Smith",
  relationship: HouseholdMemberRelationship.cousin,
  birthYear: "1998",
  birthMonth: "3",
  birthDay: "28",
  workInRegion: YesNoEnum.yes,
  sameAddress: YesNoEnum.no,
  householdMemberAddress: {
    id: "address_1_id",
    createdAt: new Date(),
    updatedAt: new Date(),
    city: "New London",
    state: "",
    zipCode: "",
    street: "",
  },
}

describe("<FormHouseholdMembers>", () => {
  it("should render the add household member button and drawer", async () => {
    render(
      <FormProviderWrapper>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <FormHouseholdMembers householdMembers={[]} setHouseholdMembers={() => {}} />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /household members/i })
    ).toBeInTheDocument()

    const addMemberButton = screen.getByRole("button", { name: /add household member/i })
    expect(addMemberButton).toBeInTheDocument()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()

    await act(() => userEvent.click(addMemberButton))

    const drawerTitle = screen.getByRole("heading", { level: 1, name: /^household member$/i })
    expect(drawerTitle).toBeInTheDocument()

    const drawerContainer = drawerTitle.parentElement.parentElement
    expect(
      within(drawerContainer).getByRole("heading", { level: 2, name: /household details/i })
    ).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/first name/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/middle name \(optional\)/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/last name/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByText(/date of birth/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/month/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/day/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/year/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/relationship/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByText(/same address as primary/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByText(/work in region/i)).toBeInTheDocument()

    expect(within(drawerContainer).getByRole("button", { name: /submit/i }))
    expect(within(drawerContainer).getByRole("button", { name: /cancel/i }))

    expect(within(drawerContainer).queryByText(/residence address/i)).not.toBeInTheDocument()
    expect(within(drawerContainer).queryByText(/work address/i)).not.toBeInTheDocument()
    expect(screen.queryAllByLabelText(/street address/i)).toHaveLength(0)
    expect(screen.queryAllByLabelText(/apt or unit #/i)).toHaveLength(0)
    expect(screen.queryAllByLabelText(/city/i)).toHaveLength(0)
    expect(screen.queryAllByLabelText(/state/i)).toHaveLength(0)
    expect(screen.queryAllByLabelText(/zip code/i)).toHaveLength(0)
  })

  it("show residance address fields when same address as primary is set to no", async () => {
    render(
      <FormProviderWrapper>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <FormHouseholdMembers householdMembers={[]} setHouseholdMembers={() => {}} />
      </FormProviderWrapper>
    )

    const addMemberButton = screen.getByRole("button", { name: /add household member/i })
    expect(addMemberButton).toBeInTheDocument()

    await act(() => userEvent.click(addMemberButton))

    const drawerTitle = screen.getByRole("heading", { level: 1, name: /^household member$/i })
    expect(drawerTitle).toBeInTheDocument()

    const drawerContainer = drawerTitle.parentElement.parentElement
    const noRadioButton = within(
      within(drawerContainer).getByText(/same address as primary/i).parentElement
    ).getByLabelText(/no/i)

    expect(noRadioButton).toBeInTheDocument()
    await act(() => userEvent.click(noRadioButton))

    expect(screen.getByText(/residence address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(1)
  })

  it("show word address fields when does not work in the region", async () => {
    render(
      <FormProviderWrapper>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <FormHouseholdMembers householdMembers={[]} setHouseholdMembers={() => {}} />
      </FormProviderWrapper>
    )

    const addMemberButton = screen.getByRole("button", { name: /add household member/i })
    expect(addMemberButton).toBeInTheDocument()

    await act(() => userEvent.click(addMemberButton))

    const drawerTitle = screen.getByRole("heading", { level: 1, name: /^household member$/i })
    expect(drawerTitle).toBeInTheDocument()

    const drawerContainer = drawerTitle.parentElement.parentElement
    const yesRadioButton = within(
      within(drawerContainer).getByText(/work in region/i).parentElement
    ).getByLabelText(/yes/i)

    expect(yesRadioButton).toBeInTheDocument()
    await act(() => userEvent.click(yesRadioButton))

    expect(screen.getByText(/work address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(1)
  })

  it("should show both address section if required", async () => {
    render(
      <FormProviderWrapper>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <FormHouseholdMembers householdMembers={[]} setHouseholdMembers={() => {}} />
      </FormProviderWrapper>
    )

    const addMemberButton = screen.getByRole("button", { name: /add household member/i })
    expect(addMemberButton).toBeInTheDocument()

    await act(() => userEvent.click(addMemberButton))

    const drawerTitle = screen.getByRole("heading", { level: 1, name: /^household member$/i })
    expect(drawerTitle).toBeInTheDocument()

    const drawerContainer = drawerTitle.parentElement.parentElement

    const yesRadioButton = within(
      within(drawerContainer).getByText(/work in region/i).parentElement
    ).getByLabelText(/yes/i)
    const noRadioButton = within(
      within(drawerContainer).getByText(/same address as primary/i).parentElement
    ).getByLabelText(/no/i)

    expect(yesRadioButton).toBeInTheDocument()
    expect(noRadioButton).toBeInTheDocument()

    await act(async () => {
      await userEvent.click(yesRadioButton)
      await userEvent.click(noRadioButton)
    })

    expect(screen.getByText(/residence address/i)).toBeInTheDocument()
    expect(screen.getByText(/work address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(2)
  })

  it("should render hosuehold members table", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdMembers
          householdMembers={[mockHouseholdMember]}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setHouseholdMembers={() => {}}
        />
      </FormProviderWrapper>
    )

    const membersTable = screen.getByRole("table")
    expect(membersTable).toBeInTheDocument()

    const headAndBody = within(membersTable).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)

    const [head, body] = headAndBody

    const tableHeaders = within(head).getAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(6)
    const [name, relationship, dob, residence, work, action] = tableHeaders
    expect(name).toHaveTextContent(/name/i)
    expect(relationship).toHaveTextContent(/relationship/i)
    expect(dob).toHaveTextContent(/date of birth/i)
    expect(residence).toHaveTextContent(/same residence/i)
    expect(work).toHaveTextContent(/work in region/i)
    expect(action).toHaveTextContent(/actions/i)

    const tableBodyRows = within(body).getAllByRole("row")
    expect(tableBodyRows).toHaveLength(1)
    const [nameVal, relationshipVal, dobVal, residenceVal, workVal, actionVal] = within(
      tableBodyRows[0]
    ).getAllByRole("cell")
    expect(nameVal).toHaveTextContent("John Smith")
    expect(relationshipVal).toHaveTextContent("Cousin")
    expect(dobVal).toHaveTextContent("3/28/1998")
    expect(residenceVal).toHaveTextContent("No")
    expect(workVal).toHaveTextContent("Yes")
    expect(within(actionVal).getByRole("button", { name: /edit/i }))
    expect(within(actionVal).getByRole("button", { name: /delete/i }))
  })

  it("should open delete modal on delete household member click", async () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdMembers
          householdMembers={[mockHouseholdMember]}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setHouseholdMembers={() => {}}
        />
      </FormProviderWrapper>
    )

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    expect(deleteButton).toBeInTheDocument()

    await act(() => userEvent.click(deleteButton))

    const popupTitle = await screen.findByRole("heading", {
      level: 1,
      name: /delete this member\?/i,
    })

    const popupContainer = popupTitle.parentElement.parentElement
    expect(within(popupContainer).getByText(/do you really want to delete this member\?/i))
    expect(within(popupContainer).getByRole("button", { name: /cancel/i }))
    expect(within(popupContainer).getByRole("button", { name: /delete/i }))
  })

  it("should open filled-out drawer on edit member click", async () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdMembers
          householdMembers={[
            {
              ...mockHouseholdMember,
              householdMemberWorkAddress: mockHouseholdMember.householdMemberAddress,
            },
          ]}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setHouseholdMembers={() => {}}
        />
      </FormProviderWrapper>
    )

    const editButton = screen.getByRole("button", { name: /edit/i })
    expect(editButton).toBeInTheDocument()

    await act(() => userEvent.click(editButton))

    const drawerTitle = screen.getByRole("heading", { level: 1, name: /^household member$/i })
    expect(drawerTitle).toBeInTheDocument()

    const drawerContainer = drawerTitle.parentElement.parentElement
    expect(within(drawerContainer).getByLabelText(/first name/i)).toHaveValue("John")
    expect(within(drawerContainer).getByLabelText(/middle name \(optional\)/i)).toHaveValue("Mark")
    expect(within(drawerContainer).getByLabelText(/last name/i)).toHaveValue("Smith")
    expect(within(drawerContainer).getByLabelText(/month/i)).toHaveValue("3")
    expect(within(drawerContainer).getByLabelText(/day/i)).toHaveValue("28")
    expect(within(drawerContainer).getByLabelText(/year/i)).toHaveValue("1998")
    expect(within(drawerContainer).getByLabelText(/relationship/i)).toHaveValue("cousin")

    const workAddress = within(drawerContainer).getByText(/work in region/i)
    const primaryAdress = within(drawerContainer).getByText(/same address as primary/i)

    expect(within(workAddress.parentElement).getByLabelText(/yes/i)).toBeChecked()
    expect(within(workAddress.parentElement).getByLabelText(/no/i)).not.toBeChecked()
    expect(within(primaryAdress.parentElement).getByLabelText(/yes/i)).not.toBeChecked()
    expect(within(primaryAdress.parentElement).getByLabelText(/no/i)).toBeChecked()
  })
})
