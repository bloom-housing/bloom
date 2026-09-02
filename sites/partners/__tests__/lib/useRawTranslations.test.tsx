import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { LanguagesEnum, SiteEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TranslationScope, useRawTranslations } from "../../src/lib/hooks"

const getRawTranslations = jest.fn()
const getRawPartnersTranslations = jest.fn()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    <AuthContext.Provider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={{ translationsService: { getRawTranslations, getRawPartnersTranslations } as any }}
    >
      {children}
    </AuthContext.Provider>
  </SWRConfig>
)

const jurisdictionScope = (jurisdictionId: string, site = SiteEnum.public) =>
  ({ type: "jurisdiction", jurisdictionId, site } as const)

const globalScope = { type: "global" } as const

const renderRawTranslations = (scope: TranslationScope | null) =>
  renderHook(() => useRawTranslations(scope, LanguagesEnum.en), { wrapper })

describe("useRawTranslations", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getRawTranslations.mockResolvedValue([])
    getRawPartnersTranslations.mockResolvedValue([])
  })

  it("issues no request until a scope is chosen", () => {
    const { result } = renderRawTranslations(null)

    expect(result.current.cacheKey).toBeNull()
    expect(getRawTranslations).not.toHaveBeenCalled()
    expect(getRawPartnersTranslations).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
  })

  it("keys the cache by jurisdiction, site, and language, so each scope is fetched separately", async () => {
    const { result } = renderRawTranslations(jurisdictionScope("jurisdiction1"))

    expect(result.current.cacheKey).toEqual(
      "/api/adapter/translations/jurisdictions/jurisdiction1/raw/public/en"
    )
    await waitFor(() => expect(getRawTranslations).toHaveBeenCalledTimes(1))
  })

  it("reports loading until the overrides arrive, which is what keeps the grid uneditable", async () => {
    const { result } = renderRawTranslations(jurisdictionScope("jurisdiction1"))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => expect(result.current.data).toEqual([]))
    expect(result.current.loading).toBe(false)
  })

  it("stops reporting loading when the request fails", async () => {
    getRawTranslations.mockRejectedValue(new Error("boom"))
    const { result } = renderRawTranslations(jurisdictionScope("jurisdiction1"))

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it("returns the overrides the service supplies", async () => {
    getRawTranslations.mockResolvedValue([{ key: "a.key", value: "Override" }])
    const { result } = renderRawTranslations(jurisdictionScope("jurisdiction1"))

    await waitFor(() => expect(result.current.data).toHaveLength(1))
    expect(result.current.data[0].key).toEqual("a.key")
  })

  it("reads the global Partners scope, which names no jurisdiction", async () => {
    getRawPartnersTranslations.mockResolvedValue([
      { key: "nav.siteTitlePartners", value: "Portal" },
    ])
    const { result } = renderRawTranslations(globalScope)

    expect(result.current.cacheKey).toEqual("/api/adapter/translations/partners/raw/en")
    await waitFor(() => expect(result.current.data).toHaveLength(1))
    expect(getRawPartnersTranslations).toHaveBeenCalledWith({ language: LanguagesEnum.en })
    // The jurisdiction endpoint has no scope to name here, so it must not be the one called.
    expect(getRawTranslations).not.toHaveBeenCalled()
  })

  it("keys the global scope apart from a jurisdiction's, so switching refetches", async () => {
    const { result: global } = renderRawTranslations(globalScope)
    const { result: jurisdictional } = renderRawTranslations(jurisdictionScope("jurisdiction1"))

    expect(global.current.cacheKey).not.toEqual(jurisdictional.current.cacheKey)
    await waitFor(() => expect(getRawPartnersTranslations).toHaveBeenCalledTimes(1))
    expect(getRawTranslations).toHaveBeenCalledTimes(1)
  })

  it("does not refetch on window focus or reconnect, which would move data under an edit", async () => {
    const { result } = renderRawTranslations(jurisdictionScope("jurisdiction1"))
    await waitFor(() => expect(getRawTranslations).toHaveBeenCalledTimes(1))

    window.dispatchEvent(new Event("focus"))
    window.dispatchEvent(new Event("online"))

    await waitFor(() => expect(result.current.data).toEqual([]))
    expect(getRawTranslations).toHaveBeenCalledTimes(1)
  })
})
