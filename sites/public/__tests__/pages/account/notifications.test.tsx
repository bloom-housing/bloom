import { useRouter } from "next/router"
import { render, screen, within } from "../../testUtils"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlagEnum,
  RegionEnum,
  User,
  UserNotificationPreferences,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Notifications from "../../../src/pages/account/notifications"
import userEvent from "@testing-library/user-event"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUserService = {
  retrieve: jest.fn(),
  getNotificationPreferences: jest.fn(),
  updateNotificationPreferences: jest.fn(),
}

describe("<Notifications>", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
      query: {},
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
    })
    jest.spyOn(console, "warn").mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders notifications settings page", async () => {
    const mockNotificationPreferences: UserNotificationPreferences = {
      lottery: false,
      waitlist: false,
      mobility: false,
      hearing: false,
      vision: false,
      hearingAndVision: false,
      mobilityAndHearing: false,
      mobilityAndVision: false,
      mobilityHearingAndVision: false,
      wantsRegionNotifs: false,
      regions: [],
    }

    mockUserService.retrieve.mockResolvedValue(user)
    mockUserService.getNotificationPreferences.mockResolvedValue(mockNotificationPreferences)
    render(
      <AuthContext.Provider
        value={{
          profile: {
            isAdvocate: false,
          } as User,
          userService: mockUserService as unknown as UserService,
        }}
      >
        <Notifications
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                id: "feature_flag_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                name: FeatureFlagEnum.enableCustomListingNotifications,
                description: "",
                active: true,
                jurisdictions: [],
              },
            ],
          }}
        />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("link", { name: /my profile/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /my notifications/i })).toBeInTheDocument()

    const formWrapper = await screen.findByRole("article")
    expect(formWrapper).toBeInTheDocument()

    const selectAllCheckbox = within(formWrapper).getByRole("checkbox", { name: /select all/i })
    expect(selectAllCheckbox).toBeInTheDocument()
    expect(selectAllCheckbox).not.toBeChecked()
    expect(
      within(selectAllCheckbox.parentElement.parentElement).getByText(
        "Subscribe to all notification types"
      )
    ).toBeInTheDocument()

    const hearingAndVisionCheckbox = within(formWrapper).getByRole("checkbox", {
      name: /^hearing\/vision units$/i,
    })
    expect(hearingAndVisionCheckbox).toBeInTheDocument()
    expect(hearingAndVisionCheckbox).not.toBeChecked()
    expect(
      within(hearingAndVisionCheckbox.parentElement.parentElement).getByText(
        "Receive notifications for units with hearing/vision accessibility"
      )
    ).toBeInTheDocument()

    const mobilityCheckbox = within(formWrapper).getByRole("checkbox", { name: /mobility units/i })
    expect(mobilityCheckbox).toBeInTheDocument()
    expect(mobilityCheckbox).not.toBeChecked()
    expect(
      within(mobilityCheckbox.parentElement.parentElement).getByText(
        "Receive notifications for new mobility accessible units"
      )
    ).toBeInTheDocument()

    const mobilityHearingAndVisionCheckbox = within(formWrapper).getByRole("checkbox", {
      name: /mobility and hearing\/vision units/i,
    })
    expect(mobilityHearingAndVisionCheckbox).toBeInTheDocument()
    expect(mobilityHearingAndVisionCheckbox).not.toBeChecked()
    expect(
      within(mobilityHearingAndVisionCheckbox.parentElement.parentElement).getByText(
        "Receive notifications for units with both mobility and hearing/vision accessibility"
      )
    ).toBeInTheDocument()

    const newLotteriesCheckbox = within(formWrapper).getByRole("checkbox", {
      name: /new lotteries/i,
    })
    expect(newLotteriesCheckbox).toBeInTheDocument()
    expect(
      within(newLotteriesCheckbox.parentElement.parentElement).getByText(
        "Receive notifications when new housing lotteries open"
      )
    ).toBeInTheDocument()

    const newWaitlistCheckbox = within(formWrapper).getByRole("checkbox", {
      name: /new waitlists/i,
    })
    expect(newWaitlistCheckbox).toBeInTheDocument()
    expect(newWaitlistCheckbox).not.toBeChecked()
    expect(
      within(newWaitlistCheckbox.parentElement.parentElement).getByText(
        "Receive notifications when new waitlists become available"
      )
    ).toBeInTheDocument()

    const regionsButtons = within(formWrapper).getByText(/^regions$/i)
    expect(regionsButtons).toBeInTheDocument()
    expect(within(formWrapper).getByText("No regions selected")).toBeInTheDocument()
    Object.values(RegionEnum).map((region) => {
      expect(
        screen.getByRole("checkbox", {
          name: region.replace("_", " "),
        })
      ).toBeInTheDocument()
    })
  })

  it("should update regions counter on selection", async () => {
    const mockNotificationPreferences: UserNotificationPreferences = {
      lottery: false,
      waitlist: false,
      mobility: false,
      hearing: false,
      vision: false,
      hearingAndVision: false,
      mobilityAndHearing: false,
      mobilityAndVision: false,
      mobilityHearingAndVision: false,
      wantsRegionNotifs: false,
      regions: [],
    }

    mockUserService.retrieve.mockResolvedValue(user)
    mockUserService.getNotificationPreferences.mockResolvedValue(mockNotificationPreferences)
    render(
      <AuthContext.Provider
        value={{
          profile: {
            isAdvocate: false,
          } as User,
          userService: mockUserService as unknown as UserService,
        }}
      >
        <Notifications
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                id: "feature_flag_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                name: FeatureFlagEnum.enableCustomListingNotifications,
                description: "",
                active: true,
                jurisdictions: [],
              },
            ],
          }}
        />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("link", { name: /my profile/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /my notifications/i })).toBeInTheDocument()

    const formWrapper = await screen.findByRole("article")
    expect(formWrapper).toBeInTheDocument()

    const regionsButton = within(formWrapper).getByText(/^regions$/i)
    expect(regionsButton).toBeInTheDocument()
    expect(within(formWrapper).getByText("No regions selected")).toBeInTheDocument()

    const regionsCheckboxes = Object.values(RegionEnum).map((region) =>
      screen.getByRole("checkbox", {
        name: region.replace("_", " "),
      })
    )

    await userEvent.click(regionsCheckboxes[0])
    expect(await within(formWrapper).findByText("1 region selected")).toBeInTheDocument()

    await userEvent.click(regionsCheckboxes[1])
    expect(await within(formWrapper).findByText("2 regions selected")).toBeInTheDocument()
  })
})
