import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import {
  addressFields,
  createEmailSubmitHandler,
  createNameSubmitHandler,
  createPasswordSubmitHandler,
} from "../../../src/components/account/EditAccountHelpers"

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

  beforeEach(() => {
    jest.clearAllMocks()
    userService = {
      updatePublic: jest.fn(),
      updateAdvocate: jest.fn(),
    }
    setAlert = jest.fn()
    setLoading = jest.fn()
    setUser = jest.fn()
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
        userService as any,
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
      jest.spyOn(console, "warn").mockImplementation(() => undefined)
      userService.updatePublic.mockRejectedValue(new Error("name update failed"))

      const handler = createNameSubmitHandler(
        userService as any,
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
        userService as any,
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
      jest.spyOn(console, "log").mockImplementation(() => undefined)
      jest.spyOn(console, "warn").mockImplementation(() => undefined)
      userService.updatePublic.mockRejectedValue(new Error("email update failed"))

      const handler = createEmailSubmitHandler(
        userService as any,
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
    })
  })

  describe("createPasswordSubmitHandler", () => {
    it("shows empty password alert when password fields are empty", async () => {
      const handler = createPasswordSubmitHandler(
        userService as any,
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
        userService as any,
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
        userService as any,
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
      jest.spyOn(console, "warn").mockImplementation(() => undefined)
      userService.updatePublic.mockRejectedValue({ response: { status: 401 } })

      const handler = createPasswordSubmitHandler(
        userService as any,
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
    })

    it("shows generic error alert on non-401 failures", async () => {
      jest.spyOn(console, "warn").mockImplementation(() => undefined)
      userService.updatePublic.mockRejectedValue({ response: { status: 500 } })

      const handler = createPasswordSubmitHandler(
        userService as any,
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

      render(<>{addressFields({} as any, jest.fn() as any, userWithPoBox as any, true, true)}</>)

      expect(screen.getByTestId("account-address-po-box")).toHaveValue("1234")
      expect(screen.queryByTestId("account-address-street")).not.toBeInTheDocument()
    })
  })
})
