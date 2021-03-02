import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { HouseholdSizeField } from "../../src/forms/HouseholdSizeField"
import { Listing } from "@bloom-housing/backend-core/types"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import { useForm } from "react-hook-form"
import { t } from "../../src/helpers/translator"

const listing = Object.assign({}, ArcherListing) as Listing

afterEach(cleanup)

const DefaultHouseholdSize = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <HouseholdSizeField
      listing={listing}
      householdSize={3}
      validate={true}
      register={register}
      error={null}
      clearErrors={() => {}}
      assistanceUrl={""}
    />
  )
}

type ErrorHouseholdSizeProps = {
  clearErrorsSpy: jest.Mock<any, any>
}

const ErrorHouseholdSize = (props: ErrorHouseholdSizeProps) => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <HouseholdSizeField
      listing={listing}
      householdSize={3}
      validate={true}
      register={register}
      error={{ message: "Uh oh!" }}
      clearErrors={props.clearErrorsSpy}
      assistanceUrl={""}
    />
  )
}

describe("<HouseholdSizeField>", () => {
  it("renders default state", () => {
    const { queryByText } = render(<DefaultHouseholdSize />)
    expect(queryByText("Uh oh!")).toBeNull()
    expect(queryByText(t("application.household.dontQualifyHeader"))).toBeNull()
    expect(queryByText(t("nav.getAssistance"))).toBeNull()
  })
  it("renders error state", () => {
    const clearErrorsSpy = jest.fn()
    const { getByText, getByRole } = render(<ErrorHouseholdSize clearErrorsSpy={clearErrorsSpy} />)
    expect(getByText("Uh oh!")).toBeTruthy()
    expect(getByText(t("application.household.dontQualifyHeader"))).toBeTruthy()
    expect(getByText(t("nav.getAssistance"))).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(clearErrorsSpy).toHaveBeenCalledTimes(1)
  })
})
