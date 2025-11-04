import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { FormProvider, useForm } from "react-hook-form"
import { screen, waitFor } from "@testing-library/react"
import RankingsAndResults from "../../../../../src/components/listings/PaperListingForm/sections/RankingsAndResults"
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

const server = setupServer()
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("RankingsAndResults", () => {
  const adminUserWithWaitlistLotteryFlag = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithWaitlistLottery",
        featureFlags: [
          {
            name: FeatureFlagEnum.enableWaitlistLottery,
            active: true,
          },
        ],
      },
    ],
  }

  const adminUserWithoutWaitlistLotteryFlag = {
    jurisdictions: [
      {
        id: "jurisdiction1",
        name: "jurisdictionWithoutWaitlistLottery",
        featureFlags: [],
      },
    ],
  }

  it("should show lottery fields when enableWaitlistLottery is true, waitlist is open, and lottery is selected", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithWaitlistLotteryFlag))
      })
    )

    render(
      <FormComponent
        values={{
          ...formDefaults,
          jurisdictions: { id: "jurisdiction1" },
          listingAvailabilityQuestion: "openWaitlist",
        }}
      >
        <RankingsAndResults
          requiredFields={[]}
          whatToExpectEditor={null}
          whatToExpectAdditionalTextEditor={null}
        />
      </FormComponent>
    )

    await screen.findByText("Rankings & results")

    const waitlistYesRadio = document.getElementById("waitlistOpenYes") as HTMLInputElement
    await userEvent.click(waitlistYesRadio)

    await screen.findByText("How is the application review order determined?")

    const lotteryRadio = document.getElementById("reviewOrderLottery") as HTMLInputElement
    await userEvent.click(lotteryRadio)

    await waitFor(
      () => {
        expect(screen.queryByTestId("lottery-start-date")).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByTestId("lottery-start-time")).toBeInTheDocument()
    expect(screen.getByTestId("lottery-end-time")).toBeInTheDocument()
  })

  it("should not show lottery fields when enableWaitlistLottery is false and waitlist is open", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithoutWaitlistLotteryFlag))
      })
    )

    render(
      <FormComponent
        values={{
          ...formDefaults,
          jurisdictions: { id: "jurisdiction1" },
          listingAvailabilityQuestion: "openWaitlist",
        }}
      >
        <RankingsAndResults
          requiredFields={[]}
          whatToExpectEditor={null}
          whatToExpectAdditionalTextEditor={null}
        />
      </FormComponent>
    )

    await screen.findByText("Rankings & results")

    const waitlistYesRadio = await screen.findByRole("radio", { name: "Yes" })
    await userEvent.click(waitlistYesRadio)

    expect(
      screen.queryByText("How is the application review order determined?")
    ).not.toBeInTheDocument()

    expect(screen.queryByTestId("lottery-start-date")).not.toBeInTheDocument()
    expect(screen.queryByTestId("lottery-start-time")).not.toBeInTheDocument()
    expect(screen.queryByTestId("lottery-end-time")).not.toBeInTheDocument()
  })

  it("should not show lottery fields when waitlist is not open even with feature flag enabled", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(adminUserWithWaitlistLotteryFlag))
      })
    )

    render(
      <FormComponent
        values={{
          ...formDefaults,
          jurisdictions: { id: "jurisdiction1" },
          listingAvailabilityQuestion: "openWaitlist",
        }}
      >
        <RankingsAndResults
          requiredFields={[]}
          whatToExpectEditor={null}
          whatToExpectAdditionalTextEditor={null}
        />
      </FormComponent>
    )

    await screen.findByText("Rankings & results")

    const waitlistYesRadio = document.getElementById("waitlistOpenYes") as HTMLInputElement
    await userEvent.click(waitlistYesRadio)

    await waitFor(() => {
      expect(
        screen.getByText("How is the application review order determined?")
      ).toBeInTheDocument()
    })

    const waitlistNoRadio = document.getElementById("waitlistOpenNo") as HTMLInputElement
    await userEvent.click(waitlistNoRadio)

    await waitFor(() => {
      expect(
        screen.queryByText("How is the application review order determined?")
      ).not.toBeInTheDocument()
    })

    expect(screen.queryByTestId("lottery-start-date")).not.toBeInTheDocument()
    expect(screen.queryByTestId("lottery-start-time")).not.toBeInTheDocument()
    expect(screen.queryByTestId("lottery-end-time")).not.toBeInTheDocument()
  })
})
