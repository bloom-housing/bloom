import { renderHook } from "@testing-library/react"
import { useUnsavedChangesWarning } from "../../src/lib/hooks"

const routerEvents = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
}

jest.mock("next/router", () => ({
  useRouter: () => ({ events: routerEvents }),
}))

const message = "You have unsaved changes"

const routeChangeHandler = () =>
  routerEvents.on.mock.calls.find(([event]) => event === "routeChangeStart")?.[1] as () => void

describe("useUnsavedChangesWarning", () => {
  let addEventListener: jest.SpyInstance
  let removeEventListener: jest.SpyInstance
  let confirmSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    addEventListener = jest.spyOn(window, "addEventListener")
    removeEventListener = jest.spyOn(window, "removeEventListener")
    confirmSpy = jest.spyOn(window, "confirm")
  })

  afterEach(() => {
    addEventListener.mockRestore()
    removeEventListener.mockRestore()
    confirmSpy.mockRestore()
  })

  it("registers nothing while there is nothing to lose", () => {
    renderHook(() => useUnsavedChangesWarning(false, message))

    expect(addEventListener).not.toHaveBeenCalledWith("beforeunload", expect.any(Function))
    expect(routerEvents.on).not.toHaveBeenCalled()
  })

  it("guards both the browser and in-app navigation once there are changes", () => {
    renderHook(() => useUnsavedChangesWarning(true, message))

    expect(addEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function))
    expect(routerEvents.on).toHaveBeenCalledWith("routeChangeStart", expect.any(Function))
  })

  it("lets an in-app navigation through when the admin confirms", () => {
    confirmSpy.mockReturnValue(true)
    renderHook(() => useUnsavedChangesWarning(true, message))

    expect(() => routeChangeHandler()()).not.toThrow()
    expect(confirmSpy).toHaveBeenCalledWith(message)
    expect(routerEvents.emit).not.toHaveBeenCalled()
  })

  it("aborts the navigation when the admin declines", () => {
    confirmSpy.mockReturnValue(false)
    renderHook(() => useUnsavedChangesWarning(true, message))

    // Next has no cancel API, so the transition is stopped by throwing.
    expect(() => routeChangeHandler()()).toThrow()
    expect(routerEvents.emit).toHaveBeenCalledWith("routeChangeError")
  })

  it("marks the browser event so the native prompt appears", () => {
    renderHook(() => useUnsavedChangesWarning(true, message))

    const handler = addEventListener.mock.calls.find(
      ([event]) => event === "beforeunload"
    )?.[1] as (event: Partial<BeforeUnloadEvent>) => void
    const event = { preventDefault: jest.fn(), returnValue: undefined }
    handler(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toEqual("")
  })

  it("stops guarding once the changes are saved", () => {
    const { rerender } = renderHook(
      ({ hasChanges }) => useUnsavedChangesWarning(hasChanges, message),
      { initialProps: { hasChanges: true } }
    )

    rerender({ hasChanges: false })

    expect(removeEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function))
    expect(routerEvents.off).toHaveBeenCalledWith("routeChangeStart", expect.any(Function))
  })

  it("stops guarding when the page unmounts", () => {
    const { unmount } = renderHook(() => useUnsavedChangesWarning(true, message))

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function))
    expect(routerEvents.off).toHaveBeenCalledWith("routeChangeStart", expect.any(Function))
  })
})
