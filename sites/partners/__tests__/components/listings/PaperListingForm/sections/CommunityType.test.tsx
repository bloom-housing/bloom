import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { FormProvider, useForm } from "react-hook-form"
import { act, screen } from "@testing-library/react"
import CommunityType from "../../../../../src/components/listings/PaperListingForm/sections/CommunityType"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import { mockNextRouter, render } from "../../../../testUtils"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import userEvent from "@testing-library/user-event"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

const reservedCommunityTypes = [
  {
    id: "rct1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "senior",
    description: "For folks over the age of 65",
    jurisdictions: "jursidictionId",
  },
  {
    id: "rct2",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "veteran",
    description: "For folks who served in the armed forces",
    jurisdictions: "jursidictionId",
  },
]

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

describe("CommunityType", () => {
  const adminUserWithJurisdictions = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithJurisdictionAdmin",
        featureFlags: [],
      },
    ],
  }
  const adminUserWithJurisdictionsAndFeatureFlagOn = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithJurisdictionAdmin",
        featureFlags: [
          {
            name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
            active: true,
          },
        ],
      },
    ],
  }

  it("should render the Community Type section", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictions))
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json(reservedCommunityTypes))
      })
    )

    render(
      <FormComponent>
        <CommunityType />
      </FormComponent>
    )

    // verify that the page has loaded as well as the community types
    await screen.findByRole("heading", { level: 2, name: "Community Type" })
    await screen.findByRole("option", { name: "Seniors" })

    expect(
      screen.getByText("Are there any requirements that applicants need to meet?")
    ).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Reserved Community Type" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Select One" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Seniors" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Veteran" })).toBeInTheDocument()
    expect(
      screen.getByRole("textbox", { name: "Reserved Community Description" })
    ).toBeInTheDocument()
    expect(screen.getByText("Appears in listing")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Do you want to include a community type disclaimer as the first page of the application?"
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Yes" })).toBeDisabled()
    expect(screen.getByRole("radio", { name: "No" })).toBeDisabled()
    expect(
      screen.queryAllByRole("textbox", { name: "Reserved Community Disclaimer Title" })
    ).toHaveLength(0)
  })

  it("should render the community disclaimer questions", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictions))
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json(reservedCommunityTypes))
      }),
      rest.get("http://localhost/api/adapter/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json(reservedCommunityTypes))
      })
    )

    render(
      <FormComponent>
        <CommunityType />
      </FormComponent>
    )

    // verify that the page has loaded as well as the community types
    await screen.findByRole("heading", { level: 2, name: "Community Type" })
    await screen.findByRole("option", { name: "Seniors" })

    await act(() =>
      userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Reserved Community Type" }),
        "Seniors"
      )
    )
    expect(screen.getByRole("radio", { name: "Yes" })).not.toBeDisabled()
    expect(screen.getByRole("radio", { name: "No" })).not.toBeDisabled()
    await act(() => userEvent.click(screen.getByRole("radio", { name: "Yes" })))

    expect(
      screen.getByRole("textbox", { name: "Reserved Community Disclaimer Title" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("textbox", { name: "Reserved Community Disclaimer" })
    ).toBeInTheDocument()
    expect(
      screen.getAllByText("Required to publish, appears as first page of application")
    ).toHaveLength(2)
  })

  it("should not render when swapCommunityTypesWithPrograms is true", () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictionsAndFeatureFlagOn))
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json(reservedCommunityTypes))
      })
    )
    document.cookie = "access-token-available=True"

    const results = render(
      <FormComponent>
        <CommunityType />
      </FormComponent>
    )

    expect(results.queryAllByRole("heading", { level: 2, name: "Community Type" })).toHaveLength(0)
  })
})
