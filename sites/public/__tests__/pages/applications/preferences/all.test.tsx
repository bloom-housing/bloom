import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationPreferencesAll from "../../../../src/pages/applications/preferences/all"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import {
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { randomUUID } from "crypto"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("preferences all step", () => {
    it("should render page content", () => {
      const conductor = new ApplicationConductor({}, {})
      const { getByText, getAllByText, debug, getByRole } = render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {
              listingMultiselectQuestions: [
                {
                  multiselectQuestions: {
                    id: randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    text: "preference text",
                    description: "preference description",
                    links: [{ title: "link title", url: "example.com" }],
                    applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
                  },
                  ordinal: 1,
                },
              ],
            } as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationPreferencesAll />
        </AppSubmissionContext.Provider>
      )

      debug()

      expect(
        getByText("Your household may qualify for the following housing preferences.")
      ).toBeInTheDocument()
      expect(
        getByText("If you qualify for this preference, you'll get a higher ranking.")
      ).toBeInTheDocument()
      expect(getAllByText("preference text")).toHaveLength(2)
      expect(getByText("preference description")).toBeInTheDocument()
      expect(getByRole("link", { name: "link title" })).toBeInTheDocument()
    })
  })
})
