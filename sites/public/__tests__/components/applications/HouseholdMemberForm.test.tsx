import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { HouseholdMemberForm } from "../../../src/components/applications/HouseholdMemberForm"

afterEach(cleanup)

describe("<HouseholdMemberForm>", () => {
  it("renders as a primary applicant", () => {
    global.scrollTo = jest.fn()
    const editMemberSpy = jest.fn()

    const { getByText } = render(
      <HouseholdMemberForm
        memberFirstName={"Breana"}
        memberLastName={"Oquendo"}
        key={"abcd"}
        subtitle={"Primary applicant"}
        editMember={editMemberSpy}
      />
    )
    expect(getByText("Primary applicant")).toBeTruthy()
    expect(getByText("Breana Oquendo")).toBeTruthy()
    fireEvent.click(getByText(t("t.edit")))
    expect(editMemberSpy).toHaveBeenCalledTimes(1)
  })
  it("renders as a household member", () => {
    global.scrollTo = jest.fn()
    const editMemberSpy = jest.fn()

    const { getByText } = render(
      <HouseholdMemberForm
        memberFirstName={"Sonja"}
        memberLastName={"Aldenkamp"}
        key={"abcd"}
        subtitle={"Household member"}
        editMember={editMemberSpy}
      />
    )
    expect(getByText(t("application.household.householdMember"))).toBeTruthy()
    expect(getByText("Sonja Aldenkamp")).toBeTruthy()
    fireEvent.click(getByText(t("t.edit")))
    expect(editMemberSpy).toHaveBeenCalledTimes(1)
  })
})
