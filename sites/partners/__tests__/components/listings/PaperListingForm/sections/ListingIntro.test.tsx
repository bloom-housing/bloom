import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
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
})
