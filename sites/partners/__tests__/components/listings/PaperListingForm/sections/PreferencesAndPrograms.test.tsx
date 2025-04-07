import React from "react"
import { render } from "@testing-library/react"
import { setupServer } from "msw/node"
import PreferencesAndPrograms from "../../../../../src/components/listings/PaperListingForm/sections/PreferencesAndPrograms"
import { FormProvider, useForm } from "react-hook-form"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

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
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("PreferencesAndPrograms", () => {
  describe("programs", () => {
    describe("when feature flag swapCommunityTypesWithPrograms is false", () => {
      // default state
      it("should show programs section as programs", () => {
        const programs: MultiselectQuestion[] = [
          {
            id: "programId",
            createdAt: new Date(),
            updatedAt: new Date(),
            text: "Program 1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: undefined,
          },
        ]
        const setFn = jest.fn()
        const results = render(
          <AuthContext.Provider
            value={{
              doJurisdictionsHaveFeatureFlagOn: () => {
                return false
              },
            }}
          >
            <FormComponent values={{ ...formDefaults }}>
              <PreferencesAndPrograms
                preferences={[]}
                setPreferences={setFn}
                programs={programs}
                setPrograms={setFn}
              />
            </FormComponent>
          </AuthContext.Provider>
        )

        expect(results.getByText("Housing Programs")).toBeTruthy()
        expect(
          results.getByText(
            "Tell us about any additional housing programs related to this listing."
          )
        ).toBeTruthy()
        expect(results.getByText("Edit Programs")).toBeTruthy()
        expect(results.queryByText("Community")).toBeFalsy()
      })
    })

    describe("when feature flag swapCommunityTypesWithPrograms is true", () => {
      it("should show programs section as community types", () => {
        const programs: MultiselectQuestion[] = [
          {
            id: "communityId",
            createdAt: new Date(),
            updatedAt: new Date(),
            text: "Community 1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: undefined,
          },
        ]
        const setFn = jest.fn()
        const results = render(
          <AuthContext.Provider
            value={{
              doJurisdictionsHaveFeatureFlagOn: () => {
                return true
              },
            }}
          >
            <FormComponent values={{ ...formDefaults }}>
              <PreferencesAndPrograms
                preferences={[]}
                setPreferences={setFn}
                programs={programs}
                setPrograms={setFn}
              />
            </FormComponent>
          </AuthContext.Provider>
        )

        expect(results.getByText("Community Types")).toBeTruthy()
        expect(
          results.getByText("Tell us about any additional community types related to this listing.")
        ).toBeTruthy()
        expect(results.getByText("Edit Communities")).toBeTruthy()
        expect(results.queryByText("Program")).toBeFalsy()
      })
    })
  })
})
