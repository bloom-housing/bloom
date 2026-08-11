import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { LanguagesEnum, SiteEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useRawTranslations } from "../../src/lib/hooks"

const getRawTranslations = jest.fn()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    <AuthContext.Provider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={{ translationsService: { getRawTranslations } as any }}
    >
      {children}
    </AuthContext.Provider>
  </SWRConfig>
)

const renderRawTranslations = (jurisdictionId: string) =>
  renderHook(
    () =>
      useRawTranslations({
        jurisdictionId,
        site: SiteEnum.public,
        language: LanguagesEnum.en,
      }),
    { wrapper }
  )

describe("useRawTranslations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getRawTranslations.mockResolvedValue([])
  })

  it("issues no request until a jurisdiction is chosen", async () => {
    const { result } = renderRawTranslations("")

    expect(result.current.cacheKey).toBeNull()
    expect(getRawTranslations).not.toHaveBeenCalled()
    // Without the null key the first render would fetch under an empty jurisdiction.
    expect(result.current.loading).toBe(false)
  })

  it("keys the cache by jurisdiction, site, and language, so each scope is fetched separately", async () => {
    const { result } = renderRawTranslations("jurisdiction1")

    expect(result.current.cacheKey).toEqual(
      "/api/adapter/translations/jurisdictions/jurisdiction1/raw/public/en"
    )
    await waitFor(() => expect(getRawTranslations).toHaveBeenCalledTimes(1))
  })

  it("reports loading until the overrides arrive, which is what keeps the grid uneditable", async () => {
    const { result } = renderRawTranslations("jurisdiction1")

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => expect(result.current.data).toEqual([]))
    expect(result.current.loading).toBe(false)
  })

  it("stops reporting loading when the request fails", async () => {
    getRawTranslations.mockRejectedValue(new Error("boom"))
    const { result } = renderRawTranslations("jurisdiction1")

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it("returns the overrides the service supplies", async () => {
    getRawTranslations.mockResolvedValue([{ key: "a.key", value: "Override" }])
    const { result } = renderRawTranslations("jurisdiction1")

    await waitFor(() => expect(result.current.data).toHaveLength(1))
    expect(result.current.data[0].key).toEqual("a.key")
  })

  it("does not refetch on window focus or reconnect, which would move data under an edit", async () => {
    const { result } = renderRawTranslations("jurisdiction1")
    await waitFor(() => expect(getRawTranslations).toHaveBeenCalledTimes(1))

    window.dispatchEvent(new Event("focus"))
    window.dispatchEvent(new Event("online"))

    await waitFor(() => expect(result.current.data).toEqual([]))
    expect(getRawTranslations).toHaveBeenCalledTimes(1)
  })
})
