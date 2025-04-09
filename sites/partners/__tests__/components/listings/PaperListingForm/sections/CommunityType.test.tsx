import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { FormProvider, useForm } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import CommunityType from "../../../../../src/components/listings/PaperListingForm/sections/CommunityType"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import { mockNextRouter, render } from "../../../../testUtils"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

const reservedCommunityTypes = {
  data: [
    {
      id: "rct1",

      createdAt: new Date(),

      updatedAt: new Date(),

      name: "Seniors",

      description: "For folks over the age of 65",

      jurisdictions: "jursidictionId",
    },
    {
      id: "rct2",

      createdAt: new Date(),

      updatedAt: new Date(),

      name: "Veterans",

      description: "For folks who served in the armed forces",

      jurisdictions: "jursidictionId",
    },
  ],
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

describe("CommunityType", () => {
  const adminUserWithJurisdictions = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithJurisdictionAdmin",
        featureFlags: [
          {
            name: "swapCommunityTypesWithPrograms",
            active: true,
          },
        ],
      },
    ],
  }
  // issue with infinite useEffect re-renders
  it.skip("should not render when swapCommunityTypesWithPrograms is true", () => {
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithJurisdictions))
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json(reservedCommunityTypes))
      })
    )
    document.cookie = "access-token-available=True"

    const results = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => {
            return true
          },
        }}
      >
        <FormComponent>
          <CommunityType />
        </FormComponent>
      </AuthContext.Provider>
    )

    expect(results.queryByText("Community")).toBeFalsy()
  })
  it.todo("should render when swapCommunityTypesWithPrograms is true")
})
