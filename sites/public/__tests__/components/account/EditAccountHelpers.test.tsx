import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import {
  addressFields,
  createAddressSubmitHandler,
  createDobSubmitHandler,
  createEmailSubmitHandler,
  createNameSubmitHandler,
  createPasswordSubmitHandler,
  createPhoneSubmitHandler,
} from "../../../src/components/account/EditAccountHelpers"
import { UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

describe("EditAccountHelpers", () => {
  const baseUser = {
    id: "user-id",
    firstName: "First",
    middleName: "Middle",
    lastName: "Last",
    email: "first@example.com",
  }

  let userService: {
    updatePublic: jest.Mock
    updateAdvocate: jest.Mock
  }

  let setAlert: jest.Mock
  let setLoading: jest.Mock
  let setUser: jest.Mock
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    userService = {
      updatePublic: jest.fn(),
      updateAdvocate: jest.fn(),
    }
    setAlert = jest.fn()
    setLoading = jest.fn()
    setUser = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("createNameSubmitHandler", () => {
    it("updates user name and sets success alert", async () => {
      const updatedUser = {
        ...baseUser,
        firstName: "Homer",
        middleName: "Q",
        lastName: "Simpson",
      }
      userService.updatePublic.mockResolvedValue(updatedUser)

      const handler = createNameSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({ firstName: "Homer", middleName: "Q", lastName: "Simpson" })

      expect(userService.updatePublic).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          firstName: "Homer",
          middleName: "Q",
          lastName: "Simpson",
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("account.settings.alerts.nameSuccess"),
      })
    })

    it("sets generic error alert when update fails", async () => {
      userService.updatePublic.mockRejectedValue(new Error("name update failed"))

      const handler = createNameSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({ firstName: "Homer", middleName: "Q", lastName: "Simpson" })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("createEmailSubmitHandler", () => {
    it("sends appUrl and newEmail, then sets success alert", async () => {
      const updatedUser = {
        ...baseUser,
        email: "new@example.com",
      }
      userService.updatePublic.mockResolvedValue(updatedUser)

      const handler = createEmailSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({ email: "new@example.com" })

      expect(userService.updatePublic).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          appUrl: window.location.origin,
          newEmail: "new@example.com",
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("account.settings.alerts.emailSuccess"),
      })
    })

    it("sets generic error alert when email update fails", async () => {
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined)
      userService.updatePublic.mockRejectedValue(new Error("email update failed"))

      const handler = createEmailSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({ email: "new@example.com" })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleLogSpy).toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("createDobSubmitHandler", () => {
    it("updates dob and sets success alert", async () => {
      const updatedUser = {
        ...baseUser,
        dob: new Date("1990-05-12"),
      }
      userService.updatePublic.mockResolvedValue(updatedUser)

      const handler = createDobSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        dateOfBirth: {
          birthDay: "12",
          birthMonth: "05",
          birthYear: "1990",
        },
      })

      expect(userService.updatePublic).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          dob: expect.any(Date),
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("account.settings.alerts.dobSuccess"),
      })
    })

    it("sets generic error alert when dob update fails", async () => {
      userService.updatePublic.mockRejectedValue(new Error("dob update failed"))

      const handler = createDobSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        dateOfBirth: {
          birthDay: "12",
          birthMonth: "05",
          birthYear: "1990",
        },
      })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("createAddressSubmitHandler", () => {
    it("updates address using PO Box format and sets success alert", async () => {
      const userWithAddress = {
        ...baseUser,
        address: {
          street: "100 Main St",
          street2: "Unit 2",
          city: "Oakland",
          state: "CA",
          zipCode: "94612",
        },
      }
      const updatedUser = {
        ...userWithAddress,
        address: {
          ...userWithAddress.address,
          street: "PO Box 1234",
          street2: "",
        },
      }
      userService.updateAdvocate.mockResolvedValue(updatedUser)

      const handler = createAddressSubmitHandler(
        userService as unknown as UserService,
        "updateAdvocate",
        setAlert,
        setLoading,
        setUser,
        userWithAddress
      )

      await handler({
        isPOBox: "yes",
        poBox: "po box 1234",
        city: "Oakland",
        state: "CA",
        zipCode: "94612",
      })

      expect(userService.updateAdvocate).toHaveBeenCalledWith({
        body: {
          ...userWithAddress,
          address: {
            ...userWithAddress.address,
            street: "PO Box 1234",
            street2: "",
            city: "Oakland",
            state: "CA",
            zipCode: "94612",
          },
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("users.userUpdated"),
      })
    })

    it("sets generic error alert when address update fails", async () => {
      userService.updateAdvocate.mockRejectedValue(new Error("address update failed"))

      const handler = createAddressSubmitHandler(
        userService as unknown as UserService,
        "updateAdvocate",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        isPOBox: "no",
        street: "100 Main St",
        street2: "Unit 2",
        city: "Oakland",
        state: "CA",
        zipCode: "94612",
      })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("createPhoneSubmitHandler", () => {
    it("updates primary and additional phone fields and sets success alert", async () => {
      const updatedUser = {
        ...baseUser,
        phoneNumber: "4155551212",
        phoneType: "cell",
      }
      userService.updateAdvocate.mockResolvedValue(updatedUser)

      const handler = createPhoneSubmitHandler(
        userService as unknown as UserService,
        "updateAdvocate",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        phoneNumber: "4155551212",
        phoneType: "cell",
        phoneExtension: "77",
        hasAdditionalPhone: true,
        additionalPhoneNumber: "5105553434",
        additionalPhoneNumberType: "work",
        additionalPhoneExtension: "99",
      })

      expect(userService.updateAdvocate).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          phoneNumber: "4155551212",
          phoneType: "cell",
          phoneExtension: "77",
          additionalPhoneNumber: "5105553434",
          additionalPhoneNumberType: "work",
          additionalPhoneExtension: "99",
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("users.userUpdated"),
      })
    })

    it("clears additional phone fields when toggle is false", async () => {
      userService.updateAdvocate.mockResolvedValue(baseUser)

      const handler = createPhoneSubmitHandler(
        userService as unknown as UserService,
        "updateAdvocate",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        phoneNumber: "4155551212",
        phoneType: "home",
        phoneExtension: "",
        hasAdditionalPhone: false,
        additionalPhoneNumber: "5105553434",
        additionalPhoneNumberType: "work",
        additionalPhoneExtension: "99",
      })

      expect(userService.updateAdvocate).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          phoneNumber: "4155551212",
          phoneType: "home",
          phoneExtension: undefined,
          additionalPhoneNumber: undefined,
          additionalPhoneNumberType: undefined,
          additionalPhoneExtension: undefined,
        },
      })
    })

    it("sets generic error alert when phone update fails", async () => {
      userService.updateAdvocate.mockRejectedValue(new Error("phone update failed"))

      const handler = createPhoneSubmitHandler(
        userService as unknown as UserService,
        "updateAdvocate",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        phoneNumber: "4155551212",
        phoneType: "home",
        phoneExtension: "",
        hasAdditionalPhone: false,
        additionalPhoneNumber: "",
        additionalPhoneNumberType: "",
        additionalPhoneExtension: "",
      })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("createPasswordSubmitHandler", () => {
    it("shows empty password alert when password fields are empty", async () => {
      const handler = createPasswordSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        currentPassword: "current-password",
        password: "",
        passwordConfirmation: "",
      })

      expect(userService.updatePublic).not.toHaveBeenCalled()
      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.passwordEmpty"),
      })
    })

    it("shows mismatch alert when password and confirmation differ", async () => {
      const handler = createPasswordSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        currentPassword: "current-password",
        password: "newPassword123!",
        passwordConfirmation: "differentPassword123!",
      })

      expect(userService.updatePublic).not.toHaveBeenCalled()
      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.passwordMatch"),
      })
    })

    it("updates password and sets success alert", async () => {
      const updatedUser = {
        ...baseUser,
      }
      userService.updatePublic.mockResolvedValue(updatedUser)

      const handler = createPasswordSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        currentPassword: "current-password",
        password: "newPassword123!",
        passwordConfirmation: "newPassword123!",
      })

      expect(userService.updatePublic).toHaveBeenCalledWith({
        body: {
          ...baseUser,
          currentPassword: "current-password",
          password: "newPassword123!",
        },
      })
      expect(setUser).toHaveBeenCalledWith(updatedUser)
      expect(setAlert).toHaveBeenCalledWith({
        type: "success",
        message: t("account.settings.alerts.passwordSuccess"),
      })
    })

    it("shows current password alert on 401", async () => {
      userService.updatePublic.mockRejectedValue({ response: { status: 401 } })

      const handler = createPasswordSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        currentPassword: "current-password",
        password: "newPassword123!",
        passwordConfirmation: "newPassword123!",
      })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.currentPassword"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it("shows generic error alert on non-401 failures", async () => {
      userService.updatePublic.mockRejectedValue({ response: { status: 500 } })

      const handler = createPasswordSubmitHandler(
        userService as unknown as UserService,
        "updatePublic",
        setAlert,
        setLoading,
        setUser,
        baseUser
      )

      await handler({
        currentPassword: "current-password",
        password: "newPassword123!",
        passwordConfirmation: "newPassword123!",
      })

      expect(setUser).not.toHaveBeenCalled()
      expect(setAlert).toHaveBeenCalledWith({
        type: "alert",
        message: t("account.settings.alerts.genericError"),
      })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("addressFields", () => {
    it("shows PO box field and strips prefix from default value", () => {
      const userWithPoBox = {
        ...baseUser,
        address: {
          street: "PO Box 1234",
          street2: "",
          city: "Oakland",
          state: "CA",
          zipCode: "94612",
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<>{addressFields({} as any, jest.fn() as any, userWithPoBox as any, true, true)}</>)

      expect(screen.getByTestId("account-address-po-box")).toHaveValue("1234")
      expect(screen.queryByTestId("account-address-street")).not.toBeInTheDocument()
    })
  })
})
