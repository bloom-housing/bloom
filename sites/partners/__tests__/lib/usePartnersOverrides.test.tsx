import { renderHook, waitFor } from "@testing-library/react"
import { usePartnersOverrides } from "../../src/lib/hooks"

const fetchMock = jest.fn()

describe("usePartnersOverrides", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock as unknown as typeof fetch
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ "nav.title": "From the database" }),
    })
  })

  it("requests the global partners overrides for the locale it is given", async () => {
    const { result } = renderHook(() => usePartnersOverrides("es"))

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/adapter/translations?language=es",
      expect.anything()
    )
    expect(result.current.overrides).toEqual({ "nav.title": "From the database" })
  })

  it("defaults to English when no locale is set", async () => {
    const { result } = renderHook(() => usePartnersOverrides())

    await waitFor(() => expect(result.current.settled).toBe(true))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/adapter/translations?language=en",
      expect.anything()
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
      expect.anything()
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
})
