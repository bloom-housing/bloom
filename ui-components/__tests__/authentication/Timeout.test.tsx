import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LoggedInUserIdleTimeout, IdleTimeout } from "../../src/authentication/timeout"
import { UserContext } from "../../src/authentication/UserContext"
import { ConfigContext } from "../../src/config/ConfigContext"

import { t } from "../../src/helpers/translator"
import { create } from "domain"

afterEach(cleanup)

describe("<Timeout>", () => {
  //   it("calls onTimeout after timeout window", async () => {
  //     jest.useFakeTimers()
  //     const onTimeoutSpy = jest.fn()
  //     const { getByText } = render(
  //       <IdleTimeout
  //         promptTitle={t("t.areYouStillWorking")}
  //         promptText={t("authentication.timeout.text")}
  //         promptAction={t("authentication.timeout.action")}
  //         redirectPath={`/sign-in`}
  //         alertMessage={t("authentication.timeout.signOutMessage")}
  //         alertType={"notice"}
  //         onTimeout={onTimeoutSpy}
  //       />
  //     )

  //     expect(onTimeoutSpy).toHaveBeenCalledTimes(0)
  //     jest.advanceTimersByTime(70000)
  //     expect(onTimeoutSpy).toHaveBeenCalledTimes(1)
  //   })

  //   it("does not call onTimeout until timeout window", async () => {
  //     const onTimeoutSpy = jest.fn()
  //     const { getByText } = render(
  //       <IdleTimeout
  //         promptTitle={t("t.areYouStillWorking")}
  //         promptText={t("authentication.timeout.text")}
  //         promptAction={t("authentication.timeout.action")}
  //         redirectPath={`/sign-in`}
  //         alertMessage={t("authentication.timeout.signOutMessage")}
  //         alertType={"notice"}
  //         onTimeout={onTimeoutSpy}
  //       />
  //     )
  //     expect(onTimeoutSpy).toHaveBeenCalledTimes(0)
  //   })

  it("creates element if user is logged in", async () => {
    const onTimeoutSpy = jest.fn()
    const anchorMocked = document.createElement("div")
    const createElementSpy = jest.spyOn(document, "createElement").mockReturnValueOnce(anchorMocked)
    const { getByText, debug } = render(
      <UserContext.Provider
        value={{
          profile: {
            roles: [],
            id: "1234",
            email: "",
            firstName: "Waffle",
            lastName: "House",
            dob: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          signOut: () => {},
        }}
      >
        <LoggedInUserIdleTimeout onTimeout={onTimeoutSpy} />
      </UserContext.Provider>
    )
    expect(createElementSpy).toHaveBeenCalledTimes(2)
    createElementSpy.mockRestore()
  })

  it("does not create element if user is not logged in", async () => {
    const onTimeoutSpy = jest.fn()
    const anchorMocked = document.createElement("div")
    const createElementSpy = jest.spyOn(document, "createElement").mockReturnValueOnce(anchorMocked)
    const { getByText, debug } = render(
      <UserContext.Provider
        value={{
          signOut: () => {},
        }}
      >
        <LoggedInUserIdleTimeout onTimeout={onTimeoutSpy} />
      </UserContext.Provider>
    )
    expect(createElementSpy).toHaveBeenCalledTimes(1)
    createElementSpy.mockRestore()
  })

  //   it("testing", async (done) => {
  //     const onTimeoutSpy = jest.fn()
  //     const { getByText, debug } = render(
  //       <ConfigContext.Provider value={{ idleTimeout: 100000000, storageType: "local", apiUrl: "" }}>
  //         <IdleTimeout
  //           promptTitle={t("t.areYouStillWorking")}
  //           promptText={t("authentication.timeout.text")}
  //           promptAction={t("authentication.timeout.action")}
  //           redirectPath={`/sign-in`}
  //           alertMessage={t("authentication.timeout.signOutMessage")}
  //           alertType={"notice"}
  //           onTimeout={onTimeoutSpy}
  //         />
  //       </ConfigContext.Provider>
  //     )
  //     debug()
  //     setTimeout(() => {
  //       debug()
  //       done()
  //     }, 0)
  //   })
})
