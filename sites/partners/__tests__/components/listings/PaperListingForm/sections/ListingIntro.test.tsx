import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import userEvent from "@testing-library/user-event"
import { screen, within } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../../../testUtils"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import ListingIntro from "../../../../../src/components/listings/PaperListingForm/sections/ListingIntro"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("ListingIntro", () => {
  const adminUserWithJurisdictions = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithJurisdictionAdmin",
        featureFlags: [],
      },
    ],
  }

  it("should render the ListingIntro section with one jurisdiction", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictions))
      })
    )

    render(
      <FormComponent>
        <ListingIntro
          requiredFields={[]}
          jurisdictions={[
            {
              id: "JurisdictionA",
              name: "JurisdictionA",
            } as unknown as Jurisdiction,
          ]}
        />
      </FormComponent>
    )

    await screen.findByRole("heading", { level: 2, name: "Listing intro" })
    expect(
      screen.getByText("Let's get started with some basic information about your listing.")
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Listing name *" })).toBeInTheDocument()
    expect(screen.queryByRole("combobox", { name: "Jurisdiction *" })).not.toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Housing developer" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()
  })

  it("should render the ListingIntro section with multiple jurisdictions and required developer", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictions))
      })
    )

    render(
      <FormComponent>
        <ListingIntro
          requiredFields={["developer"]}
          jurisdictions={[
            {
              id: "JurisdictionA",
              name: "JurisdictionA",
            } as unknown as Jurisdiction,
            {
              id: "JurisdictionB",
              name: "JurisdictionB",
            } as unknown as Jurisdiction,
          ]}
        />
      </FormComponent>
    )

    expect(screen.getByRole("textbox", { name: "Listing name *" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Jurisdiction *" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Jurisdiction *" }),
      screen.getByRole("option", { name: "JurisdictionA" })
    )

    expect(screen.getByRole("textbox", { name: "Housing developer *" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()
  })

  it("should render appropriate text when housing developer owner feature flag is on", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            jurisdictions: [
              {
                id: "JurisdictionA",
                name: "jurisdictionWithJurisdictionAdmin",
                featureFlags: [{ name: FeatureFlagEnum.enableHousingDeveloperOwner, active: true }],
              },
            ],
          })
        )
      })
    )

    render(
      <FormComponent>
        <ListingIntro
          requiredFields={[]}
          jurisdictions={[
            {
              id: "JurisdictionA",
              name: "JurisdictionA",
              featureFlags: [{ name: FeatureFlagEnum.enableHousingDeveloperOwner, active: true }],
            } as unknown as Jurisdiction,
          ]}
        />
      </FormComponent>
    )
    await screen.findByRole("textbox", { name: "Housing developer / owner" })
    expect(screen.getByRole("textbox", { name: "Housing developer / owner" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Housing developer" })).not.toBeInTheDocument()
  })

  it("should render listing file number field when feature flag is on after jurisdiction is selected", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            jurisdictions: [
              {
                id: "JurisdictionA",
                name: "jurisdictionWithJurisdictionAdmin",
                featureFlags: [{ name: FeatureFlagEnum.enableListingFileNumber, active: true }],
              },
            ],
          })
        )
      })
    )

    render(
      <FormComponent>
        <ListingIntro
          requiredFields={[]}
          jurisdictions={[
            {
              id: "JurisdictionA",
              name: "JurisdictionA",
              featureFlags: [{ name: FeatureFlagEnum.enableListingFileNumber, active: true }],
            } as unknown as Jurisdiction,
            {
              id: "JurisdictionB",
              name: "JurisdictionB",
              featureFlags: [{ name: FeatureFlagEnum.enableListingFileNumber, active: true }],
            } as unknown as Jurisdiction,
          ]}
        />
      </FormComponent>
    )

    expect(screen.queryByRole("textbox", { name: "Listing file number" })).not.toBeInTheDocument()

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Jurisdiction *" }),
      screen.getByRole("option", { name: "JurisdictionA" })
    )

    expect(screen.getByRole("textbox", { name: "Listing file number" })).toBeInTheDocument()
  })

  it("should render the ListingIntro section with regulated fields when feature flag is on", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            jurisdictions: [
              {
                id: "JurisdictionA",
                name: "JurisdictionA",
                featureFlags: [{ name: FeatureFlagEnum.enableNonRegulatedListings, active: false }],
              },
              {
                id: "JurisdictionB",
                name: "JurisdictionB",
                featureFlags: [{ name: FeatureFlagEnum.enableNonRegulatedListings, active: true }],
              },
            ],
          })
        )
      })
    )

    render(
      <FormComponent>
        <ListingIntro
          requiredFields={[]}
          jurisdictions={[
            {
              id: "JurisdictionA",
              name: "JurisdictionA",
              featureFlags: [{ name: FeatureFlagEnum.enableNonRegulatedListings, active: false }],
            } as unknown as Jurisdiction,
            {
              id: "JurisdictionB",
              name: "JurisdictionB",
              featureFlags: [{ name: FeatureFlagEnum.enableNonRegulatedListings, active: true }],
            } as unknown as Jurisdiction,
          ]}
        />
      </FormComponent>
    )

    const jurisdictionSelect = await screen.findByRole("combobox", { name: /jurisdiction/i })
    expect(jurisdictionSelect).toBeInTheDocument()
    await userEvent.selectOptions(jurisdictionSelect, "JurisdictionA")

    // Verify that without the feature flag new fields are not renderd
    expect(
      await screen.queryByRole("group", { name: "What kind of listing is this?" })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^housing developer$/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("textbox", { name: /^property management account$/i })
    ).not.toBeInTheDocument()

    let ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })

    // Switch to the jurisdiction with the feature flag enabled
    await userEvent.selectOptions(jurisdictionSelect, "JurisdictionB")

    expect(
      await screen.findByRole("group", { name: "What kind of listing is this?" })
    ).toBeInTheDocument()
    const requlatedListingOption = screen.getByRole("radio", { name: /^regulated$/i })
    const nonRequlatedListingOption = screen.getByRole("radio", { name: /^non-regulated$/i })
    expect(requlatedListingOption).toBeInTheDocument()
    expect(requlatedListingOption).toBeChecked()
    expect(nonRequlatedListingOption).toBeInTheDocument()
    expect(nonRequlatedListingOption).not.toBeChecked()

    ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })
    expect(ebllQuestionLabel).not.toBeInTheDocument()

    await userEvent.click(nonRequlatedListingOption)

    expect(
      screen.getByRole("textbox", { name: /^property management account$/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: /^housing developer$/i })).not.toBeInTheDocument()

    ebllQuestionLabel = screen.queryByRole("group", {
      name: "Has this property received HUD EBLL clearance?",
    })
    expect(ebllQuestionLabel).toBeInTheDocument()
    const ebllQuestionContainer = ebllQuestionLabel.parentElement
    const ebllYesOption = within(ebllQuestionContainer).getByRole("radio", { name: /^yes$/i })
    const ebllNoOption = within(ebllQuestionContainer).getByRole("radio", { name: /^no$/i })
    expect(ebllYesOption).toBeInTheDocument()
    expect(ebllYesOption).not.toBeChecked()
    expect(ebllNoOption).toBeInTheDocument()
    expect(ebllNoOption).toBeChecked()
  })
})
