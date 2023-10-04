import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { HouseholdMemberForm } from "../../src/forms/HouseholdMemberForm"
import { t } from "@bloom-housing/ui-components"

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
        subtitle={"Primary Applicant"}
        editMember={editMemberSpy}
      />
    )
    expect(getByText("Primary Applicant")).toBeTruthy()
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
        subtitle={"Household Member"}
        editMember={editMemberSpy}
      />
    )
    expect(getByText(t("application.household.householdMember"))).toBeTruthy()
    expect(getByText("Sonja Aldenkamp")).toBeTruthy()
    fireEvent.click(getByText(t("t.edit")))
    expect(editMemberSpy).toHaveBeenCalledTimes(1)
  })
})
