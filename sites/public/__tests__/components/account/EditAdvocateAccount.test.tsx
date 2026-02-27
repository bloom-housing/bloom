import React from "react"
import { useRouter } from "next/router"
import userEvent from "@testing-library/user-event"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Agency, User, UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { EditAdvocateAccount } from "../../../src/components/account/EditAdvocateAccount"
import { render, screen, waitFor } from "../../testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUserService = {
  retrieve: jest.fn(),
  updateAdvocate: jest.fn(),
}

const agencies = [
  { id: "agency-1", name: "Agency One" },
  { id: "agency-2", name: "Agency Two" },
]

const renderEditAdvocateAccount = (userOverrides = {}) => {
  const testUser = {
    ...user,
    firstName: "First",
    middleName: "Middle",
    lastName: "Last",
    agency: { id: "agency-1", name: "Agency One" },
    address: {
      street: "PO Box 111",
      street2: "Unit 4",
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
    },
    phoneNumber: "(415) 555-1212",
    phoneType: "cell",
    phoneExtension: "",
    additionalPhoneNumber: undefined,
    additionalPhoneNumberType: undefined,
    additionalPhoneExtension: undefined,
    listings: [],
    jurisdictions: [],
    ...userOverrides,
  }

  mockUserService.retrieve.mockResolvedValue(testUser)

  return render(
    <AuthContext.Provider
      value={{
        profile: { id: testUser.id, isAdvocate: true } as User,
        userService: mockUserService as unknown as UserService,
      }}
    >
      <EditAdvocateAccount agencies={agencies as Agency[]} />
    </AuthContext.Provider>
  )
}

describe("EditAdvocateAccount", () => {
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    ;(useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
      query: {},
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should load the user and render all advocate account sections", async () => {
    renderEditAdvocateAccount()

    await waitFor(() => {
      expect(mockUserService.retrieve).toHaveBeenCalledWith({ id: "user_1" })
    })

    // These are the IDs of the form sections we expect to appear
    expect(document.getElementById("update-name")).toBeInTheDocument()
    expect(document.getElementById("update-agency")).toBeInTheDocument()
    expect(document.getElementById("update-address")).toBeInTheDocument()
    expect(document.getElementById("update-phone-number")).toBeInTheDocument()
    expect(document.getElementById("update-email")).toBeInTheDocument()
    expect(document.getElementById("update-password")).toBeInTheDocument()
  })

  it("should submit agency updates through updateAdvocate", async () => {
    mockUserService.updateAdvocate.mockResolvedValue({
      ...user,
      agency: { id: "agency-2", name: "Agency Two" },
    })

    renderEditAdvocateAccount()

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "First or given name" })).toBeInTheDocument()
    })

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Agency" }), "agency-2")
    await userEvent.click(screen.getByRole("button", { name: "Update Agency" }))

    await waitFor(() => {
      expect(mockUserService.updateAdvocate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          agency: { id: "agency-2" },
        }),
      })
    })
  })

  it("should format PO box address values before submitting", async () => {
    mockUserService.updateAdvocate.mockResolvedValue({
      ...user,
      address: {
        street: "PO Box 4321",
        street2: "",
        city: "Oakland",
        state: "CA",
        zipCode: "94612",
      },
    })

    renderEditAdvocateAccount()

    await waitFor(() => {
      expect(screen.getByTestId("account-address-po-box")).toBeInTheDocument()
    })

    const poBoxField = screen.getByTestId("account-address-po-box")
    await userEvent.clear(poBoxField)
    await userEvent.type(poBoxField, "4321")
    await userEvent.click(screen.getByRole("button", { name: "Update Address" }))

    await waitFor(() => {
      expect(mockUserService.updateAdvocate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          address: expect.objectContaining({
            street: "PO Box 4321",
            street2: "",
            city: "Oakland",
            state: "CA",
            zipCode: "94612",
          }),
        }),
      })
    })
  })

  it("should clear additional phone fields when toggle is off on submit", async () => {
    mockUserService.updateAdvocate.mockResolvedValue({
      ...user,
      additionalPhoneNumber: undefined,
      additionalPhoneNumberType: undefined,
      additionalPhoneExtension: undefined,
    })

    renderEditAdvocateAccount({
      additionalPhoneNumber: "(650) 555-7777",
      additionalPhoneNumberType: "work",
      additionalPhoneExtension: "123",
    })

    await waitFor(() => {
      expect(screen.getByTestId("account-additional-phone-toggle")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId("account-additional-phone-toggle"))
    await userEvent.click(screen.getByRole("button", { name: "Update Your phone number" }))

    await waitFor(() => {
      expect(mockUserService.updateAdvocate).toHaveBeenCalledWith({
        body: expect.objectContaining({
          additionalPhoneNumber: undefined,
          additionalPhoneNumberType: undefined,
          additionalPhoneExtension: undefined,
        }),
      })
    })
  })

  it("should show an error alert when advocate update fails", async () => {
    mockUserService.updateAdvocate.mockRejectedValue(new Error("Server error"))

    renderEditAdvocateAccount()

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "First or given name" })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: "Update Agency" }))

    await waitFor(() => {
      expect(
        screen.getByText("There was an error. Please try again, or contact support for help.")
      ).toBeInTheDocument()
    })

    expect(consoleWarnSpy).toHaveBeenCalled()
  })
})
