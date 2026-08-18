import { act, renderHook, waitFor } from "@testing-library/react"
import { OVERRIDES_TIMEOUT_MS, usePartnersOverrides } from "../../src/lib/partnersOverrides"

const fetchMock = jest.fn()
const realFetch = global.fetch

// Resolves only when the test says so, so a request can be left in flight.
const deferred = <T,>() => {
  let resolve: (value: T) => void
  let reject: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const okResponse = (body: Record<string, string>) => ({
  ok: true,
  json: () => Promise.resolve(body),
})

describe("usePartnersOverrides", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock as unknown as typeof fetch
    fetchMock.mockResolvedValue(okResponse({ "nav.title": "From the database" }))
  })

  afterEach(() => {
    jest.useRealTimers()
    global.fetch = realFetch
  })

  it("requests the global partners overrides for the locale it is given", async () => {
    const { result } = renderHook(() => usePartnersOverrides("es"))

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/adapter/translations?language=es",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    expect(result.current.overrides).toEqual({ "nav.title": "From the database" })
  })

  it("defaults to English when no locale is set", async () => {
    const { result } = renderHook(() => usePartnersOverrides())

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/adapter/translations?language=en",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
  })

  it("is unsettled until the request resolves, so the portal can wait", () => {
    fetchMock.mockReturnValue(new Promise(() => undefined))
    const { result } = renderHook(() => usePartnersOverrides("en"))

    expect(result.current.settled).toBe(false)
    expect(result.current.overrides).toBeUndefined()
  })

  it("settles with no overrides when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network down"))
    const { result } = renderHook(() => usePartnersOverrides("en"))

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(result.current.overrides).toBeUndefined()
  })

  it("settles with no overrides when the request is not ok", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: () => Promise.resolve({}) })
    const { result } = renderHook(() => usePartnersOverrides("en"))

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(result.current.overrides).toBeUndefined()
  })

  it("refetches when the locale changes", async () => {
    const { result, rerender } = renderHook(({ locale }) => usePartnersOverrides(locale), {
      initialProps: { locale: "en" },
    })
    await waitFor(() => expect(result.current.settled).toBe(true))

    rerender({ locale: "es" })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/adapter/translations?language=es",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
  })

  it("does not refetch when the locale is unchanged", async () => {
    const { result, rerender } = renderHook(({ locale }) => usePartnersOverrides(locale), {
      initialProps: { locale: "en" },
    })
    await waitFor(() => expect(result.current.settled).toBe(true))

    rerender({ locale: "en" })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("settles with no overrides when the response body is not JSON", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.reject(new Error("not json")) })
    const { result } = renderHook(() => usePartnersOverrides("en"))

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(result.current.overrides).toBeUndefined()
  })

  // Without this the portal renders nothing until the socket times out, since the first paint
  // waits on `settled`.
  it("settles on its own when the request never answers", async () => {
    jest.useFakeTimers()
    const hanging = deferred<Response>()
    fetchMock.mockImplementation((_url, init: RequestInit) => {
      init.signal.addEventListener("abort", () => hanging.reject(new Error("aborted")))
      return hanging.promise
    })
    const { result } = renderHook(() => usePartnersOverrides("en"))

    expect(result.current.settled).toBe(false)
    await act(async () => {
      jest.advanceTimersByTime(OVERRIDES_TIMEOUT_MS)
      await Promise.resolve()
    })

    expect(result.current.settled).toBe(true)
    expect(result.current.overrides).toBeUndefined()
  })

  // The gate closing mid-session would unmount the page the admin is on and drop its state.
  it("keeps the portal rendered while a locale change is in flight", async () => {
    const { result, rerender } = renderHook(({ locale }) => usePartnersOverrides(locale), {
      initialProps: { locale: "en" },
    })
    await waitFor(() => expect(result.current.settled).toBe(true))

    const pending = deferred<Response>()
    fetchMock.mockReturnValue(pending.promise)
    rerender({ locale: "es" })

    expect(result.current.settled).toBe(true)
    expect(result.current.overrides).toEqual({ "nav.title": "From the database" })

    await act(async () => {
      pending.resolve(okResponse({ "nav.title": "Desde la base de datos" }) as unknown as Response)
      await Promise.resolve()
    })
    expect(result.current.overrides).toEqual({ "nav.title": "Desde la base de datos" })
  })

  // The request outlives the component, so the abort is what stops it settling into nothing.
  it("abandons a request in flight when the component goes away", async () => {
    const pending = deferred<Response>()
    let aborted = false
    fetchMock.mockImplementation((_url, init: RequestInit) => {
      init.signal.addEventListener("abort", () => (aborted = true))
      return pending.promise
    })
    const { result, unmount } = renderHook(() => usePartnersOverrides("en"))

    expect(result.current.settled).toBe(false)
    unmount()

    expect(aborted).toBe(true)

    await act(async () => {
      pending.resolve(okResponse({ "nav.title": "Too late" }) as unknown as Response)
      await Promise.resolve()
    })
    expect(result.current.settled).toBe(false)
  })

  it("ignores a superseded response that lands after a newer one", async () => {
    const first = deferred<Response>()
    fetchMock.mockReturnValueOnce(first.promise)
    const { result, rerender } = renderHook(({ locale }) => usePartnersOverrides(locale), {
      initialProps: { locale: "en" },
    })

    fetchMock.mockResolvedValue(okResponse({ "nav.title": "Spanish" }))
    rerender({ locale: "es" })
    await waitFor(() => expect(result.current.overrides).toEqual({ "nav.title": "Spanish" }))

    // The English request resolves late; its value must not replace the Spanish one.
    await act(async () => {
      first.resolve(okResponse({ "nav.title": "English" }) as unknown as Response)
      await Promise.resolve()
    })
    expect(result.current.overrides).toEqual({ "nav.title": "Spanish" })
  })
})
