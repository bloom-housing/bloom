import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { blankApplication } from "@bloom-housing/shared-helpers"
import ApplicationIncome from "../../../../src/pages/applications/financial/income"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import { mockNextRouter, render } from "../../../testUtils"

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

  const renderIncomeWithConfig = (enableVerifyIncome: boolean) => {
    const conductor = new ApplicationConductor({}, {})
    const applicationConfig = retrieveApplicationConfig(conductor.listing, [])
    conductor.config = {
      ...applicationConfig,
      isAdvocate: false,
      languages: [],
      featureFlags: [
        { name: FeatureFlagEnum.enableVerifyIncome, active: enableVerifyIncome } as FeatureFlag,
      ],
    }

    const routeToNextOrReturnUrlSpy = jest
      .spyOn(conductor, "routeToNextOrReturnUrl")
      .mockImplementation(() => undefined)

    render(
      <AppSubmissionContext.Provider
        value={{
          conductor,
          application: {
            ...JSON.parse(JSON.stringify(blankApplication)),
            income: "10000",
            incomePeriod: "perMonth",
            incomeVouchers: false,
          },
          listing: {
            units: [
              {
                annualIncomeMin: "12000",
                annualIncomeMax: "24000",
                monthlyIncomeMin: "1000",
              },
            ],
          } as Listing,
          syncApplication: jest.fn(),
          syncListing: jest.fn(),
        }}
      >
        <ApplicationIncome />
      </AppSubmissionContext.Provider>
    )

    return { routeToNextOrReturnUrlSpy }
  }

  describe("income step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationIncome />)

      expect(getByText("Let's move to income")).toBeInTheDocument()
      expect(getByTestId("app-income")).toBeInTheDocument()
      expect(getAllByTestId("app-income-period")).toHaveLength(2)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationIncome />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a valid number greater than 0.")).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })

    it("should block out-of-range income when verify income flag is enabled", async () => {
      const { routeToNextOrReturnUrlSpy } = renderIncomeWithConfig(true)

      fireEvent.click(screen.getByRole("button", { name: "Next" }))

      expect(await screen.findByRole("link", { name: "Get Assistance" })).toBeInTheDocument()
      expect(routeToNextOrReturnUrlSpy).not.toHaveBeenCalled()
    })

    it("should skip out-of-range income check when verify income flag is disabled", async () => {
      const { routeToNextOrReturnUrlSpy } = renderIncomeWithConfig(false)

      fireEvent.click(screen.getByRole("button", { name: "Next" }))

      await waitFor(() => expect(routeToNextOrReturnUrlSpy).toHaveBeenCalled())
      expect(screen.queryByRole("link", { name: "Get Assistance" })).not.toBeInTheDocument()
    })
  })
})
