import React from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { render, screen, within } from "@testing-library/react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailApplicationTypes from "../../../../../src/components/listings/PaperListingDetails/sections/DetailApplicationTypes"
import {
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

describe("<DetailApplicationTypes>", () => {
  it("should render the basic section component content", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            digitalApplication: false,
            paperApplication: false,
            referralOpportunity: false,
            applicationMethods: [],
            units: [],
          }}
        >
          <DetailApplicationTypes />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Application types" })).toBeInTheDocument()
    expect(screen.getByText("Online applications")).toBeInTheDocument()
    expect(screen.getByText("Paper applications")).toBeInTheDocument()
    expect(screen.getByText("Referral")).toBeInTheDocument()
    expect(screen.getAllByText("No")).toHaveLength(3)

    expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
  })

  it("should render full section component content", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            digitalApplication: true,
            paperApplication: true,
            referralOpportunity: true,
            applicationMethods: [
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.ExternalLink,
                externalReference: "https://testexternallink.com",
              },
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.Referral,
                phoneNumber: "(123) 456-7890",
                externalReference: "Test referral summary",
              },
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.FileDownload,
                paperApplications: [
                  {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    assets: {
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      id: "test_id",
                      fileId: "test/Test File Name",
                      label: "test paper application",
                    },
                    language: LanguagesEnum.en,
                  },
                ],
              },
            ],
            units: [],
          }}
        >
          <DetailApplicationTypes />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Application types" })).toBeInTheDocument()
    expect(screen.getByText("Online applications")).toBeInTheDocument()
    expect(screen.getByText("Common digital application")).toBeInTheDocument()
    expect(screen.getByText("Custom online application URL")).toBeInTheDocument()
    expect(screen.getByText("https://testexternallink.com")).toBeInTheDocument()
    expect(screen.getAllByText("Paper applications")).toHaveLength(2)
    const applicationsTable = screen.getByRole("table")
    expect(applicationsTable).toBeInTheDocument()
    const [head, body] = within(applicationsTable).getAllByRole("rowgroup")
    const headers = within(head).getAllByRole("columnheader")
    expect(headers).toHaveLength(2)
    expect(headers[0]).toHaveTextContent(/file name/i)
    expect(headers[1]).toHaveTextContent(/language/i)
    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(1)
    const [fileName, language] = within(rows[0]).getAllByRole("cell")
    expect(fileName).toHaveTextContent("Test File Name.pdf")
    expect(language).toHaveTextContent("English")
    expect(screen.getByText("Referral")).toBeInTheDocument()
    expect(screen.getByText("Referral contact phone")).toBeInTheDocument()
    expect(screen.getByText("(123) 456-7890")).toBeInTheDocument()
    expect(screen.getByText("Referral summary")).toBeInTheDocument()
    expect(screen.getByText("Test referral summary")).toBeInTheDocument()
    expect(screen.getAllByText("Yes")).toHaveLength(3)
    expect(screen.getAllByText("No")).toHaveLength(1)
  })

  it("should hide the digital common application when the disableCommonApplication is turned on", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.disableCommonApplication,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            digitalApplication: true,
            paperApplication: true,
            referralOpportunity: true,
            applicationMethods: [
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.ExternalLink,
                externalReference: "https://testexternallink.com",
              },
            ],
            units: [],
          }}
        >
          <DetailApplicationTypes />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Online applications")).toBeInTheDocument()
    expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
    expect(screen.getByText("Custom online application URL")).toBeInTheDocument()
    expect(screen.getByText("https://testexternallink.com")).toBeInTheDocument()
  })

  it("should update label when the enableReferralQuestionUnits is turned on", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableReferralQuestionUnits,
        }}
      >
        <ListingContext.Provider
          value={{
            ...listing,
            digitalApplication: true,
            paperApplication: true,
            referralOpportunity: true,
            applicationMethods: [],
            units: [],
          }}
        >
          <DetailApplicationTypes />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(screen.getByText("Referral only units")).toBeInTheDocument()
    expect(screen.queryByText("Referral")).not.toBeInTheDocument()
  })
})
