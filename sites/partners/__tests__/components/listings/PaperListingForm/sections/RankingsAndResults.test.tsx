import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { FormProvider, useForm } from "react-hook-form"
import { screen } from "@testing-library/react"
import RankingsAndResults from "../../../../../src/components/listings/PaperListingForm/sections/RankingsAndResults"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import { mockNextRouter, mockTipTapEditor, render } from "../../../../testUtils"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import userEvent from "@testing-library/user-event"

const FormComponent = ({
  children,
  values,
}: {
  values?: FormListing
  children: React.ReactNode
}) => {
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
  mockTipTapEditor()
})

describe("RankingsAndResults", () => {
  describe("RankingsAndResults enableWaitlistLottery", () => {
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    const userWithWaitlistLotteryFlag = {
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
    const userWithoutWaitlistLotteryFlag = {
      jurisdictions: [
        {
          id: "jurisdiction1",
          name: "jurisdictionWithoutWaitlistLottery",
          featureFlags: [],
        },
      ],
    }

    it("should not show lottery fields when enableWaitlistLottery is false and waitlist is open", async () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(userWithoutWaitlistLotteryFlag))
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

    it("should show review order options when waitlist is open and feature flag is enabled", async () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(userWithWaitlistLotteryFlag))
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

      screen.getByRole("heading", { name: "Rankings & results" })

      const waitlistYesRadio = await screen.findByRole("radio", { name: "Yes" })
      await userEvent.click(waitlistYesRadio)

      await screen.findByText("How is the application review order determined?")

      expect(screen.getByRole("radio", { name: /First come first serve/i })).toBeInTheDocument()
      expect(screen.getByRole("radio", { name: "Lottery" })).toBeInTheDocument()
    })

    it("should show review order options when availabilityQuestion is availableUnits and enableWaitlistLottery is false", () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(userWithoutWaitlistLotteryFlag))
        })
      )

      render(
        <FormComponent
          values={{
            ...formDefaults,
            jurisdictions: { id: "jurisdiction1" },
            listingAvailabilityQuestion: "availableUnits",
          }}
        >
          <RankingsAndResults
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
          />
        </FormComponent>
      )

      screen.getByRole("heading", { name: "Rankings & results" })
      expect(
        screen.getByText("How is the application review order determined?")
      ).toBeInTheDocument()

      expect(screen.getByRole("radio", { name: /First come first serve/i })).toBeInTheDocument()
      expect(screen.getByRole("radio", { name: "Lottery" })).toBeInTheDocument()
    })
  })
  describe("Verifying text when selecting lottery radio button", () => {
    it("should show proper message when selecting lottery as a non admin user", async () => {
      process.env.showLottery = "true"
      render(
        <FormComponent>
          <RankingsAndResults
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
          />
        </FormComponent>
      )

      screen.getByRole("heading", { name: "Rankings & results" })
      const lotteryRadio = await screen.findByRole("radio", { name: "Lottery" })
      await userEvent.click(lotteryRadio)
      expect(
        screen.getByText(
          "Your lottery will be run in the Partners Portal. If you want to make alternative arrangements, please contact staff."
        )
      ).toBeInTheDocument()
    })
    it("should show proper message when selecting lottery as an admin user", async () => {
      process.env.showLottery = "true"
      render(
        <FormComponent>
          <RankingsAndResults
            isAdmin={true}
            listing={null}
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
          />
        </FormComponent>
      )

      screen.getByRole("heading", { name: "Rankings & results" })
      const lotteryRadio = await screen.findByRole("radio", { name: "Lottery" })
      await userEvent.click(lotteryRadio)
      expect(screen.getByText("Will the lottery be run in the partner portal?")).toBeInTheDocument()
    })
  })
})
