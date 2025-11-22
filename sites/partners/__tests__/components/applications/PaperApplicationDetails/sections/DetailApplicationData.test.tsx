/* eslint-disable import/no-named-as-default */
import React from "react"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { application, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render, screen, within } from "../../../../testUtils"
import DetailsApplicationData from "../../../../../src/components/applications/PaperApplicationDetails/sections/DetailsApplicationData"
import { ApplicationContext } from "../../../../../src/components/applications/ApplicationContext"
import { AuthContext } from "@bloom-housing/shared-helpers"

describe("DetailApplicationData", () => {
  it("should display Application Data section info", () => {
    mockNextRouter({ id: "application_1" })
    render(
      <AuthContext.Provider
        value={{
          profile: { ...user, listings: [], jurisdictions: [] },
        }}
      >
        <ApplicationContext.Provider
          value={{
            ...application,
            language: LanguagesEnum.es,
            submissionDate: new Date("January 28, 2025 13:09:00"),
          }}
        >
          <DetailsApplicationData />
        </ApplicationContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { name: "Application data", level: 2 })).toBeInTheDocument()
    expect(within(screen.getByTestId("number")).getByText("Confirmation code")).toBeInTheDocument()
    expect(within(screen.getByTestId("number")).getByText("ABCD1234")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("type")).getByText("Application submission type")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("type")).getByText("Electronic")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("submittedDate")).getByText("Application submitted date")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("submittedDate")).getByText("1/28/2025")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("timeDate")).getByText("Application submitted time")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("timeDate")).getByText("1:09:00 PM UTC")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("language")).getByText("Application language")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("language")).getByText("Español")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("totalSize")).getByText("Total household size")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("totalSize")).getByText("2")).toBeInTheDocument()
    expect(within(screen.getByTestId("submittedBy")).getByText("Submitted by")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("submittedBy")).getByText("Applicant First Applicant Last")
    ).toBeInTheDocument()
  })
})
