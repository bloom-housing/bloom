import React from "react"
import { setupServer } from "msw/lib/node"
import { AuthContext } from "@bloom-housing/shared-helpers"
import userEvent from "@testing-library/user-event"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  ValidationMethodEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import PreferencesAndPrograms from "../../../../../src/components/listings/PaperListingForm/sections/PreferencesAndPrograms"
import { formDefaults } from "../../../../../src/lib/listings/formTypes"
import { render, screen, within, mockNextRouter, FormProviderWrapper } from "../../../../testUtils"
import { rest } from "msw"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  mockNextRouter()
  server.listen()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

const preference1 = {
  id: "preference_id_1",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "City Employees",
  text: "",
  jurisdictions: [],
  hideFromListing: false,
  applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
  status: MultiselectQuestionsStatusEnum.active,
}
const mockPreferences: MultiselectQuestion[] = [
  preference1,
  {
    id: "preference_id_2",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Work in the city",
    text: "",
    jurisdictions: [],
    multiselectOptions: [
      {
        name: "At least one member of my household works in the city",
        text: "",
        ordinal: 1,
        collectAddress: true,
        validationMethod: ValidationMethodEnum.map,
        collectName: true,
        collectRelationship: true,
        mapLayerId: "c1586f71-345d-4986-83a2-b83ebfa84af5",
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "All members of the household work in the city",
        text: "",
        ordinal: 2,
        collectAddress: true,
        collectName: false,
        collectRelationship: false,
        id: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    hideFromListing: false,
    applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
    status: MultiselectQuestionsStatusEnum.active,
  },
]

describe("PreferencesAndPrograms", () => {
  describe("Preferences", () => {
    beforeEach(() => {
      server.use(
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(ctx.json({ items: mockPreferences }))
        }),
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(ctx.json({ items: mockPreferences }))
        })
      )
    })
    it("should render the preference section when no preferences have been added", () => {
      const setFn = jest.fn()

      render(
        <FormProviderWrapper values={{ ...formDefaults }}>
          <PreferencesAndPrograms
            jurisdiction={"jurisdiction1"}
            preferences={[]}
            programs={[]}
            setPreferences={setFn}
            setPrograms={setFn}
            disableListingPreferences={false}
            swapCommunityTypeWithPrograms={false}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByRole("heading", { level: 2, name: /preferences/i })).toBeInTheDocument()
      expect(
        screen.getByText(
          /tell us about any preferences that will be used to rank qualifying applicants./i
        )
      ).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /add preference/i })).toBeInTheDocument()
    })

    it("should render the preference section when preferences have been added", () => {
      const mockPreferences: MultiselectQuestion[] = [
        {
          id: "preference_id_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          text: "City Employees",
          jurisdictions: [],
          hideFromListing: false,
          applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
          status: MultiselectQuestionsStatusEnum.active,
        },
        {
          id: "preference_id_2",
          createdAt: new Date(),
          updatedAt: new Date(),
          text: "Work in the city",
          jurisdictions: [],
          multiselectOptions: [
            {
              text: "At least one member of my household works in the city",
              ordinal: 0,
              collectAddress: true,
              validationMethod: ValidationMethodEnum.map,
              collectName: true,
              collectRelationship: true,
              mapLayerId: "c1586f71-345d-4986-83a2-b83ebfa84af5",
              id: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              text: "All members of the household work in the city",
              ordinal: 1,
              collectAddress: true,
              collectName: false,
              collectRelationship: false,
              id: "2",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          hideFromListing: false,
          applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
          status: MultiselectQuestionsStatusEnum.active,
        },
      ]
      const setFn = jest.fn()

      render(
        <FormProviderWrapper values={{ ...formDefaults }}>
          <PreferencesAndPrograms
            preferences={mockPreferences}
            programs={[]}
            setPreferences={setFn}
            setPrograms={setFn}
            disableListingPreferences={false}
            swapCommunityTypeWithPrograms={false}
            jurisdiction={"jurisdiction1"}
          />
        </FormProviderWrapper>
      )

      const table = screen.getByRole("table")
      expect(table).toBeInTheDocument()

      const headAndBody = within(table).getAllByRole("rowgroup")
      expect(headAndBody).toHaveLength(2)
      const [head, body] = headAndBody

      const tableHeaders = within(head).getAllByRole("columnheader")
      expect(tableHeaders).toHaveLength(4)
      expect(tableHeaders[0]).toHaveTextContent(/order/i)
      expect(tableHeaders[1]).toHaveTextContent(/name/i)
      expect(tableHeaders[2]).toHaveTextContent(/additional fields/i)
      expect(tableHeaders[3]).toHaveTextContent(/actions/i)
      const tableRows = within(body).getAllByRole("row")
      expect(tableRows).toHaveLength(2)

      const firstRowCells = within(tableRows[0]).getAllByRole("cell")
      expect(firstRowCells[0]).toHaveTextContent("1")
      expect(firstRowCells[1]).toHaveTextContent(/city employees/i)
      expect(firstRowCells[2]).toHaveTextContent("")
      expect(within(firstRowCells[3]).getByRole("button", { name: /delete/i })).toBeInTheDocument()

      const secondRowCells = within(tableRows[1]).getAllByRole("cell")
      expect(secondRowCells[0]).toHaveTextContent("2")
      expect(secondRowCells[1]).toHaveTextContent(/work in the city/i)
      expect(within(secondRowCells[2]).getByText(/provides additional fields/i)).toBeInTheDocument()
      expect(within(secondRowCells[3]).getByRole("button", { name: /delete/i })).toBeInTheDocument()
    })

    it("should open drawer and add a preference", async () => {
      const setFn = jest.fn()

      render(
        <FormProviderWrapper values={{ ...formDefaults }}>
          <PreferencesAndPrograms
            preferences={[preference1]}
            programs={[]}
            setPreferences={setFn}
            setPrograms={setFn}
            disableListingPreferences={false}
            swapCommunityTypeWithPrograms={false}
            jurisdiction={"jurisdiction1"}
            enableV2MSQ={true}
          />
        </FormProviderWrapper>
      )
      const table = screen.getByRole("table")
      expect(table).toBeInTheDocument()

      const headAndBody = within(table).getAllByRole("rowgroup")
      const body = headAndBody[1]

      const tableRows = within(body).getAllByRole("row")
      expect(tableRows).toHaveLength(1)
      const firstRow = within(tableRows[0]).getAllByRole("cell")
      expect(firstRow[0]).toHaveTextContent("1")
      expect(firstRow[1]).toHaveTextContent(/city employees/i)

      const editButton = screen.getByRole("button", { name: "Edit preferences" })
      expect(editButton).toBeInTheDocument()

      await userEvent.click(editButton)

      const dialogDrawer = await screen.findByRole("dialog", { name: "Add preferences" })
      expect(dialogDrawer).toBeInTheDocument()

      expect(
        within(dialogDrawer).getByRole("heading", { level: 1, name: "Add preferences" })
      ).toBeInTheDocument()

      expect(within(dialogDrawer).getByText(/city employees/i)).toBeInTheDocument()

      const selectButton = within(dialogDrawer).getByRole("button", { name: "Select preferences" })
      await userEvent.click(selectButton)
      const nestedDialogDrawer = await screen.findByRole("dialog", { name: "Select preferences" })
      expect(
        within(nestedDialogDrawer).getByRole("checkbox", { name: /city employees/i })
      ).toBeInTheDocument()
      expect(
        within(nestedDialogDrawer).getByRole("checkbox", { name: /work in the city/i })
      ).toBeInTheDocument()
      expect(within(nestedDialogDrawer).getAllByText("Active").length).toStrictEqual(2)

      await userEvent.click(
        within(nestedDialogDrawer).getByRole("checkbox", { name: /work in the city/i })
      )
      await userEvent.click(within(nestedDialogDrawer).getByRole("button", { name: "Save" }))
      await userEvent.click(within(dialogDrawer).getByRole("button", { name: "Save" }))

      const savedPrefs = setFn.mock.calls[0][0]
      expect(savedPrefs).toHaveLength(2)
      expect(savedPrefs[1].name).toStrictEqual("Work in the city")
    })

    it.todo("should delete a preference")

    it.todo("should reorder preference list")

    it("should hide preferences on disableListingPreferences set to true", () => {
      const setFn = jest.fn()

      render(
        <FormProviderWrapper values={{ ...formDefaults }}>
          <AuthContext.Provider
            value={{
              doJurisdictionsHaveFeatureFlagOn: () => {
                return false
              },
            }}
          >
            <PreferencesAndPrograms
              preferences={[]}
              programs={[]}
              setPreferences={setFn}
              setPrograms={setFn}
              disableListingPreferences={true}
              swapCommunityTypeWithPrograms={false}
              jurisdiction={"jurisdiction1"}
            />
          </AuthContext.Provider>
        </FormProviderWrapper>
      )

      expect(
        screen.queryByRole("heading", { level: 2, name: /preferences/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(
          /tell us about any preferences that will be used to rank qualifying applicants./i
        )
      ).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /add preference/i })).not.toBeInTheDocument()
    })
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
            text: "Families",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: undefined,
            status: MultiselectQuestionsStatusEnum.active,
          },
        ]
        const setFn = jest.fn()
        render(
          <AuthContext.Provider
            value={{
              doJurisdictionsHaveFeatureFlagOn: () => {
                return false
              },
            }}
          >
            <FormProviderWrapper values={{ ...formDefaults }}>
              <PreferencesAndPrograms
                preferences={[]}
                setPreferences={setFn}
                programs={programs}
                setPrograms={setFn}
                disableListingPreferences={false}
                swapCommunityTypeWithPrograms={false}
                jurisdiction={"jurisdiction1"}
              />
            </FormProviderWrapper>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Housing programs")).toBeInTheDocument()
        expect(
          screen.getByText("Tell us about any additional housing programs related to this listing.")
        ).toBeInTheDocument()
        expect(screen.getByText("Edit programs")).toBeInTheDocument()
        expect(screen.queryByText("Community", { exact: false })).toBeFalsy()
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
            status: MultiselectQuestionsStatusEnum.active,
          },
        ]
        const setFn = jest.fn()
        render(
          <AuthContext.Provider
            value={{
              doJurisdictionsHaveFeatureFlagOn: () => {
                return true
              },
            }}
          >
            <FormProviderWrapper values={{ ...formDefaults }}>
              <PreferencesAndPrograms
                preferences={[]}
                setPreferences={setFn}
                programs={programs}
                setPrograms={setFn}
                disableListingPreferences={false}
                swapCommunityTypeWithPrograms={true}
                jurisdiction={"jurisdiction1"}
              />
            </FormProviderWrapper>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Community types")).toBeInTheDocument()
        expect(
          screen.getByText("Tell us about any additional community types related to this listing.")
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            "Please choose the populations your building serves, based on your building's financing and regulatory agreements."
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Edit communities")).toBeInTheDocument()
        expect(screen.queryByText("Program", { exact: false })).toBeFalsy()
      })

      it.todo("should show drawer copy as community types")
    })
  })
})
