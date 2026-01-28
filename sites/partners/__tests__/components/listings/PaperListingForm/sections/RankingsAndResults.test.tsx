import React from "react"
import { setupServer } from "msw/node"
import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import RankingsAndResults from "../../../../../src/components/listings/PaperListingForm/sections/RankingsAndResults"
import { formDefaults } from "../../../../../src/lib/listings/formTypes"
import {
  FormProviderWrapper,
  mockNextRouter,
  mockTipTapEditor,
  render,
} from "../../../../testUtils"
import {
  Listing,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()
beforeAll(() => {
  server.listen()
  mockNextRouter()
  mockTipTapEditor()
})

describe("RankingsAndResults", () => {
  describe("Review Order", () => {
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("should only show waitlist fields when enableWaitlistLottery is false and waitlist is open", async () => {
      render(
        <FormProviderWrapper
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
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={false}
            enableWhatToExpectAdditionalField={false}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByRole("heading", { name: "Rankings & results" })).toBeInTheDocument()
      expect(
        screen.getByText(
          "Provide details about what happens to applications once they are submitted."
        )
      ).toBeInTheDocument()

      expect(
        screen.queryByText("How is the application review order determined?")
      ).not.toBeInTheDocument()
      const waitlistSizeGroup = screen.getByRole("group", {
        name: "Do you want to show a waitlist size?",
      })
      const waitlistYesRadio = within(waitlistSizeGroup).getByRole("radio", { name: "Yes" })
      expect(within(waitlistSizeGroup).getByRole("radio", { name: "No" })).toBeInTheDocument()
      expect(
        screen.queryByRole("spinbutton", { name: "How many spots are open on the list?" })
      ).not.toBeInTheDocument()

      // after clicking yes the waitlist size field should appear
      await userEvent.click(waitlistYesRadio)
      expect(
        screen.getByRole("spinbutton", { name: "How many spots are open on the list?" })
      ).toBeInTheDocument()

      expect(screen.queryByTestId("lottery-start-date")).not.toBeInTheDocument()
      expect(screen.queryByTestId("lottery-start-time")).not.toBeInTheDocument()
      expect(screen.queryByTestId("lottery-end-time")).not.toBeInTheDocument()
    })

    it("should show review order options when waitlist is open and enableWaitlistLottery is true", async () => {
      render(
        <FormProviderWrapper
          values={{
            ...formDefaults,
            isWaitlistOpen: true,
            jurisdictions: { id: "jurisdiction1" },
            listingAvailabilityQuestion: "openWaitlist",
          }}
        >
          <RankingsAndResults
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={true}
            enableWhatToExpectAdditionalField={false}
            listing={{ isWaitlistOpen: true } as Listing}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByRole("heading", { name: "Rankings & results" })).toBeInTheDocument()

      const reviewOrderTypeGroup = screen.getByRole("group", {
        name: "How is the application review order determined?",
      })

      expect(
        within(reviewOrderTypeGroup).getByRole("radio", { name: /First come first serve/i })
      ).toBeChecked()
      expect(
        within(reviewOrderTypeGroup).getByRole("radio", { name: "Lottery" })
      ).toBeInTheDocument()

      const waitlistSizeGroup = screen.getByRole("group", {
        name: "Do you want to show a waitlist size?",
      })
      expect(within(waitlistSizeGroup).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
      expect(within(waitlistSizeGroup).getByRole("radio", { name: "No" })).toBeInTheDocument()

      await userEvent.click(within(reviewOrderTypeGroup).getByRole("radio", { name: "Lottery" }))
      expect(
        screen.getByRole("group", { name: "When will the lottery be run?" })
      ).toBeInTheDocument()
      expect(screen.getByRole("group", { name: "Lottery start time" })).toBeInTheDocument()
      expect(screen.getByRole("group", { name: "Lottery end time" })).toBeInTheDocument()
      expect(
        within(
          screen.getByRole("group", { name: "Do you want to show a waitlist size?" })
        ).getByRole("radio", { name: "Yes" })
      ).not.toBeDisabled()
    })

    it("should show review order options when availabilityQuestion is availableUnits and enableWaitlistLottery is false", () => {
      render(
        <FormProviderWrapper
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
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={false}
            enableWhatToExpectAdditionalField={false}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByRole("heading", { name: "Rankings & results" })).toBeInTheDocument()
      const reviewOrderTypeGroup = screen.getByRole("group", {
        name: "How is the application review order determined?",
      })

      expect(
        within(reviewOrderTypeGroup).getByRole("radio", { name: /First come first serve/i })
      ).toBeChecked()
      expect(
        within(reviewOrderTypeGroup).getByRole("radio", { name: "Lottery" })
      ).toBeInTheDocument()
    })

    it("should show lottery questions when review order is lottery", () => {
      render(
        <FormProviderWrapper
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
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={false}
            enableWhatToExpectAdditionalField={false}
            listing={{ reviewOrderType: ReviewOrderTypeEnum.lottery } as Listing}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByRole("heading", { name: "Rankings & results" })).toBeInTheDocument()
      const reviewOrderTypeGroup = screen.getByRole("group", {
        name: "How is the application review order determined?",
      })

      expect(
        within(reviewOrderTypeGroup).getByRole("radio", { name: /First come first serve/i })
      ).not.toBeChecked()
      expect(within(reviewOrderTypeGroup).getByRole("radio", { name: "Lottery" })).toBeChecked()

      const lotteryRunGroup = screen.getByRole("group", { name: "When will the lottery be run?" })
      expect(within(lotteryRunGroup).getByRole("textbox", { name: "Month" })).toBeInTheDocument()
      expect(within(lotteryRunGroup).getByRole("textbox", { name: "Day" })).toBeInTheDocument()
      expect(within(lotteryRunGroup).getByRole("textbox", { name: "Year" })).toBeInTheDocument()
      const lotteryStartTimeGroup = screen.getByRole("group", { name: "Lottery start time" })
      expect(
        within(lotteryStartTimeGroup).getByRole("textbox", { name: "Hour" })
      ).toBeInTheDocument()
      expect(
        within(lotteryStartTimeGroup).getByRole("textbox", { name: "minutes" })
      ).toBeInTheDocument()
      expect(
        within(within(lotteryStartTimeGroup).getByRole("combobox", { name: "time" })).getByRole(
          "option",
          { name: "AM" }
        )
      ).toBeInTheDocument()
      const lotteryEndTimeGroup = screen.getByRole("group", { name: "Lottery end time" })
      expect(within(lotteryEndTimeGroup).getByRole("textbox", { name: "Hour" })).toBeInTheDocument()
      expect(
        within(lotteryEndTimeGroup).getByRole("textbox", { name: "minutes" })
      ).toBeInTheDocument()
      expect(
        within(within(lotteryEndTimeGroup).getByRole("combobox", { name: "time" })).getByRole(
          "option",
          { name: "AM" }
        )
      ).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Lottery date notes" })).toBeInTheDocument()
    })
  })
  describe("What to expect", () => {
    it.todo(
      "should show additional what to expect editor if enableWhatToExpectAdditionalField is true"
    )
  })
  describe("Verifying text when selecting lottery radio button", () => {
    it("should show proper message when selecting lottery as a non admin user", async () => {
      process.env.showLottery = "true"
      render(
        <FormProviderWrapper>
          <RankingsAndResults
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={false}
            enableWhatToExpectAdditionalField={false}
          />
        </FormProviderWrapper>
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
        <FormProviderWrapper>
          <RankingsAndResults
            isAdmin={true}
            listing={null}
            requiredFields={[]}
            whatToExpectEditor={null}
            whatToExpectAdditionalTextEditor={null}
            enableUnitGroups={false}
            enableWaitlistAdditionalFields={false}
            enableWaitlistLottery={false}
            enableWhatToExpectAdditionalField={false}
          />
        </FormProviderWrapper>
      )

      screen.getByRole("heading", { name: "Rankings & results" })
      const lotteryRadio = await screen.findByRole("radio", { name: "Lottery" })
      await userEvent.click(lotteryRadio)
      expect(screen.getByText("Will the lottery be run in the partner portal?")).toBeInTheDocument()
    })
  })
})
