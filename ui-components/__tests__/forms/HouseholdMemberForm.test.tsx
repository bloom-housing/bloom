import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { HouseholdMemberForm } from "../../src/forms/HouseholdMemberForm"
import { HouseholdMember } from "@bloom-housing/backend-core/types"
import { t } from "../../src/helpers/translator"

afterEach(cleanup)

const Member1 = ({
  firstName: "Breana",
  lastName: "Oquendo",
} as unknown) as HouseholdMember

const Member2 = ({
  firstName: "Sonja",
  lastName: "Aldenkamp",
  orderId: 1234,
} as unknown) as HouseholdMember

describe("<HouseholdMemberForm>", () => {
  const useContext = jest.spyOn(require("react"), "useContext")

  it("renders as a primary applicant", () => {
    const router = { push: jest.fn().mockImplementation(() => Promise.resolve()) }
    useContext.mockReturnValue({ router })
    global.scrollTo = jest.fn()

    const { getByText } = render(
      <HouseholdMemberForm member={Member1} type={t("application.household.primaryApplicant")} />
    )
    expect(getByText(t("application.household.primaryApplicant"))).toBeTruthy()
    expect(getByText("Breana Oquendo")).toBeTruthy()
    fireEvent.click(getByText(t("t.edit")))
    expect(router.push).toHaveBeenCalledWith("/applications/contact/name")
  })
  it("renders as a household member", () => {
    const router = { push: jest.fn().mockImplementation(() => Promise.resolve()) }
    useContext.mockReturnValue({ router })
    global.scrollTo = jest.fn()

    const { getByText } = render(
      <HouseholdMemberForm member={Member2} type={t("application.household.householdMember")} />
    )
    expect(getByText(t("application.household.householdMember"))).toBeTruthy()
    expect(getByText("Sonja Aldenkamp")).toBeTruthy()
    fireEvent.click(getByText(t("t.edit")))
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/applications/household/member",
      query: { memberId: 1234 },
    })
  })
})
