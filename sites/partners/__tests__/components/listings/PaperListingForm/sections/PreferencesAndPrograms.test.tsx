import React from "react"
import { setupServer } from "msw/node"
import { FormProvider, useForm } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { render } from "@testing-library/react"
import PreferencesAndPrograms from "../../../../../src/components/listings/PaperListingForm/sections/PreferencesAndPrograms"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"

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
  describe("Preferences", () => {
    it.todo("should render the preference section when no preferences have been added")

    it.todo("should render the preference section when preferences have been added")

    it.todo("should open drawer and add a preference")

    it.todo("should delete a preference")

    it.todo("should reorder preference list")
  })
  describe("Programs", () => {
    it.todo("should render the program section when no programs have been added")

    it.todo("should render the program section when programs have been added")

    it.todo("should open drawer and add a program")

    it.todo("should delete a program")

    it.todo("should reorder program list")

    // default state
    describe("when feature flag swapCommunityTypesWithPrograms is false", () => {
      it("should show programs section copy as programs", () => {
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

        expect(results.getByText("Housing Programs")).toBeInTheDocument()
        expect(
          results.getByText(
            "Tell us about any additional housing programs related to this listing."
          )
        ).toBeInTheDocument()
        expect(results.getByText("Edit Programs")).toBeInTheDocument()
        expect(results.queryByText("Community", { exact: false })).toBeFalsy()
      })

      it.todo("should show drawer copy as programs")
    })

    describe("when feature flag swapCommunityTypesWithPrograms is true", () => {
      it("should show programs section copy as community types", () => {
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

        expect(results.getByText("Community Types")).toBeInTheDocument()
        expect(
          results.getByText("Tell us about any additional community types related to this listing.")
        ).toBeInTheDocument()
        expect(
          results.getByText(
            "Please choose the populations your building serves, based on your building's financing and regulatory agreements."
          )
        ).toBeInTheDocument()
        expect(results.getByText("Edit Communities")).toBeInTheDocument()
        expect(results.queryByText("Program", { exact: false })).toBeFalsy()
      })

      it.todo("should show drawer copy as community types")
    })
  })
})
