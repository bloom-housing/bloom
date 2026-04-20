import React from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Agency,
  FeatureFlagEnum,
  User,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import Edit from "../../../src/pages/account/edit"
import { render, screen } from "../../testUtils"

jest.mock("../../../src/components/account/EditAdvocateAccount", () => ({
  EditAdvocateAccount: () => <div data-testid="edit-advocate-account" />,
}))

jest.mock("../../../src/components/account/EditPublicAccount", () => ({
  EditPublicAccount: () => <div data-testid="edit-public-account" />,
}))

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUserService = {
  retrieve: jest.fn(),
  updateAdvocate: jest.fn(),
}

describe("<Edit>", () => {
  const mockAgencies = [{ id: "agency-1", name: "Housing Department" }] as Agency[]

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

  it("renders advocate account edit form when user is an advocate", () => {
    const testUser = {
      ...user,
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
      email: "first.last@bloom.com",
      isAdvocate: true,
      isApproved: true,
      listings: [],
      jurisdictions: [],
    }
    mockUserService.retrieve.mockResolvedValue(testUser)

    render(
      <AuthContext.Provider
        value={{
          profile: {
            isAdvocate: true,
          } as User,
          userService: mockUserService as unknown as UserService,
        }}
      >
        <Edit agencies={mockAgencies} jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    )

    expect(screen.getByTestId("edit-advocate-account")).toBeInTheDocument()
    expect(screen.queryByTestId("edit-public-account")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /my profile/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /my notifications/i })).not.toBeInTheDocument()
  })

  it("renders public account edit form when user is not an advocate", () => {
    const testUser = {
      ...user,
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
      email: "first.last@bloom.com",
      isAdvocate: false,
      isApproved: false,
      listings: [],
      jurisdictions: [],
    }
    mockUserService.retrieve.mockResolvedValue(testUser)
    render(
      <AuthContext.Provider
        value={{
          profile: {
            isAdvocate: false,
          } as User,
          userService: mockUserService as unknown as UserService,
        }}
      >
        <Edit agencies={mockAgencies} jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    )

    expect(screen.getByTestId("edit-public-account")).toBeInTheDocument()
    expect(screen.queryByTestId("edit-advocate-account")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /my profile/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /my notifications/i })).not.toBeInTheDocument()
  })

  it("renders the user profile edit form in tabbed view when the enableCustomListingNotifications feature flag is on", () => {
    const testUser = {
      ...user,
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
      email: "first.last@bloom.com",
      isAdvocate: false,
      isApproved: false,
      listings: [],
      jurisdictions: [],
    }
    mockUserService.retrieve.mockResolvedValue(testUser)
    render(
      <AuthContext.Provider
        value={{
          profile: {
            isAdvocate: false,
          } as User,
          userService: mockUserService as unknown as UserService,
        }}
      >
        <Edit
          agencies={mockAgencies}
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

    expect(screen.getByTestId("edit-public-account")).toBeInTheDocument()
    expect(screen.queryByTestId("edit-advocate-account")).not.toBeInTheDocument()
  })
})
