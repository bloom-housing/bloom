import React from "react"
import { render, cleanup, fireEvent, act } from "@testing-library/react"
import { SiteAlert, setSiteAlertMessage } from "../../src/notifications/SiteAlert"

afterEach(cleanup)

describe("<SiteAlert>", () => {
  it("can set an alert in session storage", () => {
    jest.spyOn(window.sessionStorage.__proto__, "setItem")
    window.sessionStorage.__proto__.setItem = jest.fn()
    setSiteAlertMessage("Alert Message Goes Here", "success")
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "alert_message_success",
      "Alert Message Goes Here"
    )
  })
  it("can render an alert from session storage", () => {
    jest.spyOn(window.sessionStorage.__proto__, "getItem")
    window.sessionStorage.__proto__.getItem = jest.fn()
    window.sessionStorage.__proto__.getItem.mockReturnValueOnce("Alert Message Goes Here")
    const { getByText } = render(<SiteAlert />)
    expect(getByText("Alert Message Goes Here")).toBeTruthy()
  })
  it("can render as dismissable", () => {
    jest.spyOn(window.sessionStorage.__proto__, "getItem")
    window.sessionStorage.__proto__.getItem = jest.fn()
    window.sessionStorage.__proto__.getItem.mockReturnValueOnce("Alert Message Goes Here")
    const { getByText, queryByText, getByRole } = render(<SiteAlert type={"notice"} dismissable />)
    expect(getByText("Alert Message Goes Here")).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(queryByText("Alert Message Goes Here")).toBeNull()
  })
  it("can render with a timeout", () => {
    jest.useFakeTimers()
    jest.spyOn(window.sessionStorage.__proto__, "getItem")
    window.sessionStorage.__proto__.getItem = jest.fn()
    window.sessionStorage.__proto__.getItem.mockReturnValueOnce("Alert Message Goes Here")
    const { getByText, queryByText } = render(<SiteAlert timeout={100} />)
    expect(getByText("Alert Message Goes Here")).toBeTruthy()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    act(() => {
      jest.runAllTimers()
    })
    expect(queryByText("Alert Message Goes Here")).toBeNull()
  })
})
