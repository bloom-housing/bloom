import React, { useMemo, useState } from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, waitFor } from "@testing-library/react"
import { AuthContext, blankApplication } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationChooseLanguage from "../../../../src/pages/applications/start/choose-language"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationConductor, {
  loadApplicationFromAutosave,
  loadSavedListing,
} from "../../../../src/lib/applications/ApplicationConductor"

window.scrollTo = jest.fn()

const server = setupServer()

const jurisdiction = {
  id: "jurisdiction-1",
  featureFlags: [],
  languages: [LanguagesEnum.en, LanguagesEnum.es],
  visibleSpokenLanguages: [],
  visibleApplicationAccessibilityFeatures: [],
  visibleHouseholdMemberRelationships: [],
}

// Builds the context the way _app does, so a state change creates a new conductor.
const AppSubmissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [application, setApplication] = useState(
    () => loadApplicationFromAutosave() || JSON.parse(JSON.stringify(blankApplication))
  )
  const [savedListing, setSavedListing] = useState(() => loadSavedListing())
  const conductor = useMemo(
    () => new ApplicationConductor(application, savedListing),
    [application, savedListing]
  )

  return (
    <AppSubmissionContext.Provider
      value={{
        conductor,
        application,
        listing: savedListing,
        syncApplication: setApplication,
        syncListing: setSavedListing,
      }}
    >
      {children}
    </AppSubmissionContext.Provider>
  )
}

const renderChooseLanguage = () => {
  const listingsRetrieve = jest.fn().mockImplementation(({ id }, options) =>
    Promise.resolve({
      ...listing,
      id,
      name: `${listing.name} (${options.headers.language})`,
      jurisdictions: { id: jurisdiction.id },
    })
  )
  const page = (
    <AuthContext.Provider
      value={{
        initialStateLoaded: true,
        listingsService: { retrieve: listingsRetrieve },
        jurisdictionsService: { retrieve: jest.fn().mockResolvedValue(jurisdiction) },
      }}
    >
      <AppSubmissionProvider>
        <ApplicationChooseLanguage />
      </AppSubmissionProvider>
    </AuthContext.Provider>
  )
  const result = render(page)

  return { ...result, listingsRetrieve, rerenderPage: () => result.rerender(page) }
}

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  window.sessionStorage.clear()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("choose language step", () => {
  it("loads the listing once before a language is chosen", async () => {
    mockNextRouter({ listingId: listing.id })
    const { findByText, listingsRetrieve } = renderChooseLanguage()

    await findByText("Español")

    expect(listingsRetrieve).toHaveBeenCalledTimes(1)
  })

  it("saves the application and the listing when a language is chosen", async () => {
    const { pushMock } = mockNextRouter({ listingId: listing.id })
    const { findByText } = renderChooseLanguage()

    fireEvent.click(await findByText("Español"))
    await waitFor(() => expect(pushMock).toHaveBeenCalled())

    const savedApplication = JSON.parse(window.sessionStorage.getItem("bloom-app-autosave"))
    const savedListing = JSON.parse(window.sessionStorage.getItem("bloom-app-listing"))
    expect(savedApplication.language).toBe(LanguagesEnum.es)
    expect(savedListing.id).toBe(listing.id)
    expect(savedListing.name).toBe(`${listing.name} (es)`)
  })

  it("starts from a blank application when one is already saved", async () => {
    window.sessionStorage.setItem(
      "bloom-app-autosave",
      JSON.stringify({
        ...blankApplication,
        applicant: { ...blankApplication.applicant, firstName: "Previous" },
      })
    )
    const { pushMock } = mockNextRouter({ listingId: listing.id })
    const { findByText } = renderChooseLanguage()

    fireEvent.click(await findByText("Español"))
    await waitFor(() => expect(pushMock).toHaveBeenCalled())

    const savedApplication = JSON.parse(window.sessionStorage.getItem("bloom-app-autosave"))
    expect(savedApplication.applicant.firstName).toBe("")
  })

  it("starts a new application when the listing changes", async () => {
    const { pushMock } = mockNextRouter({ listingId: listing.id })
    const { findByText, listingsRetrieve, rerenderPage } = renderChooseLanguage()

    fireEvent.click(await findByText("Español"))
    await waitFor(() => expect(pushMock).toHaveBeenCalled())

    mockNextRouter({ listingId: "other-listing" })
    rerenderPage()

    await waitFor(() =>
      expect(listingsRetrieve).toHaveBeenLastCalledWith({ id: "other-listing" }, expect.anything())
    )
    expect(window.sessionStorage.getItem("bloom-app-autosave")).toBeNull()
  })
})
