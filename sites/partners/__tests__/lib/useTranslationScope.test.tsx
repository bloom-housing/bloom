import React from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Jurisdiction,
  LanguagesEnum,
  SiteEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter } from "../testUtils"
import { useTranslationScope } from "../../src/lib/useTranslationScope"

const translationsService = {
  getRawTranslations: jest.fn(),
  getRawPartnersTranslations: jest.fn(),
  updateRawTranslations: jest.fn(),
  updateRawPartnersTranslations: jest.fn(),
  deleteRawTranslation: jest.fn(),
  deleteRawPartnersTranslation: jest.fn(),
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <AuthContext.Provider value={{ translationsService } as any}>{children}</AuthContext.Provider>
  </SWRConfig>
)

const jurisdiction = (id: string, languages = [LanguagesEnum.en]) =>
  ({ id, name: id, languages } as Jurisdiction)

const renderScope = (jurisdictions: Jurisdiction[], enabled = true) =>
  renderHook(() => useTranslationScope({ jurisdictions, enabled }), { wrapper })

describe("useTranslationScope", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNextRouter()
    translationsService.getRawTranslations.mockResolvedValue([])
    translationsService.getRawPartnersTranslations.mockResolvedValue([])
  })

  it("starts on the public site and the admin's first jurisdiction", () => {
    const { result } = renderScope([jurisdiction("first"), jurisdiction("second")])

    expect(result.current.site).toEqual(SiteEnum.public)
    expect(result.current.isGlobal).toBe(false)
    expect(result.current.activeJurisdictionId).toEqual("first")
    expect(result.current.cacheKey).toEqual(
      "/api/adapter/translations/jurisdictions/first/raw/public/en"
    )
  })

  it("moves the read when the admin switches jurisdiction", () => {
    const { result } = renderScope([jurisdiction("first"), jurisdiction("second")])

    act(() => result.current.setJurisdictionId("second"))

    expect(result.current.activeJurisdictionId).toEqual("second")
    expect(result.current.cacheKey).toEqual(
      "/api/adapter/translations/jurisdictions/second/raw/public/en"
    )
  })

  it("reads the global endpoint in the Partners scope, with no jurisdiction named", () => {
    const { result } = renderScope([jurisdiction("first")])

    act(() => result.current.setSite(SiteEnum.partners))

    expect(result.current.isGlobal).toBe(true)
    expect(result.current.cacheKey).toEqual("/api/adapter/translations/partners/raw/en")
  })

  it("holds the read until a jurisdiction exists in the public scope", () => {
    const { result } = renderScope([])

    expect(result.current.cacheKey).toBeNull()
    expect(translationsService.getRawTranslations).not.toHaveBeenCalled()
  })

  it("still reads the global scope when the admin has no jurisdictions", () => {
    const { result } = renderScope([])

    act(() => result.current.setSite(SiteEnum.partners))

    expect(result.current.cacheKey).toEqual("/api/adapter/translations/partners/raw/en")
  })

  it("holds every read while the page is not authorized", () => {
    const { result } = renderScope([jurisdiction("first")], false)

    expect(result.current.cacheKey).toBeNull()
    expect(translationsService.getRawTranslations).not.toHaveBeenCalled()
  })

  it("holds the global read too while the page is not authorized", () => {
    const { result } = renderScope([jurisdiction("first")], false)

    act(() => result.current.setSite(SiteEnum.partners))

    // The global scope needs no jurisdiction, so authorization is the only thing holding it.
    expect(result.current.cacheKey).toBeNull()
    expect(translationsService.getRawPartnersTranslations).not.toHaveBeenCalled()
  })

  it("offers the jurisdiction's languages in the public scope", () => {
    const { result } = renderScope([jurisdiction("first", [LanguagesEnum.en, LanguagesEnum.es])])

    expect(result.current.languageOptions).toEqual([
      { value: "en", label: "English" },
      { value: "es", label: "Español" },
    ])
  })

  it("offers the Partners site's own locales in the global scope", () => {
    mockNextRouter(undefined, { locales: ["en", "es", "not-a-language"] })
    const { result } = renderScope([jurisdiction("first")])

    act(() => result.current.setSite(SiteEnum.partners))

    // The jurisdiction offers English only, and a locale outside the enum is dropped.
    expect(result.current.languageOptions).toEqual([
      { value: "en", label: "English" },
      { value: "es", label: "Español" },
    ])
  })

  it("falls back to English when the site lists no usable locales", () => {
    mockNextRouter(undefined, { locales: [] })
    const { result } = renderScope([jurisdiction("first")])

    act(() => result.current.setSite(SiteEnum.partners))

    // Otherwise the language select renders with nothing in it.
    expect(result.current.languageOptions).toEqual([{ value: "en", label: "English" }])
  })

  // Otherwise the editor would read a scope the jurisdiction cannot offer.
  it("falls back when the selected language is not offered by the new scope", () => {
    mockNextRouter(undefined, { locales: ["en", "es"] })
    const { result } = renderScope([jurisdiction("first")])

    act(() => result.current.setSite(SiteEnum.partners))
    act(() => result.current.setLanguage(LanguagesEnum.es))
    expect(result.current.activeLanguage).toEqual(LanguagesEnum.es)

    act(() => result.current.setSite(SiteEnum.public))

    expect(result.current.activeLanguage).toEqual(LanguagesEnum.en)
  })

  it("keeps the selected language when the new scope still offers it", () => {
    mockNextRouter(undefined, { locales: ["en", "es"] })
    const { result } = renderScope([jurisdiction("first", [LanguagesEnum.en, LanguagesEnum.es])])

    act(() => result.current.setLanguage(LanguagesEnum.es))
    act(() => result.current.setSite(SiteEnum.partners))

    expect(result.current.activeLanguage).toEqual(LanguagesEnum.es)
  })

  it("writes through the jurisdiction endpoints in the public scope", () => {
    const { result } = renderScope([jurisdiction("first")])

    void result.current.scope.save({ edits: [{ key: "a", value: "b" }] })
    void result.current.scope.revert("a")

    expect(translationsService.updateRawTranslations).toHaveBeenCalledWith({
      jurisdictionId: "first",
      site: SiteEnum.public,
      language: LanguagesEnum.en,
      body: { edits: [{ key: "a", value: "b" }] },
    })
    expect(translationsService.deleteRawTranslation).toHaveBeenCalledWith({
      jurisdictionId: "first",
      site: SiteEnum.public,
      language: LanguagesEnum.en,
      key: "a",
    })
  })

  it("writes through the Partners endpoints in the global scope", () => {
    const { result } = renderScope([jurisdiction("first")])

    act(() => result.current.setSite(SiteEnum.partners))
    void result.current.scope.save({ edits: [{ key: "a", value: "b" }] })
    void result.current.scope.revert("a")

    expect(translationsService.updateRawPartnersTranslations).toHaveBeenCalledWith({
      language: LanguagesEnum.en,
      body: { edits: [{ key: "a", value: "b" }] },
    })
    expect(translationsService.deleteRawPartnersTranslation).toHaveBeenCalledWith({
      language: LanguagesEnum.en,
      key: "a",
    })
    expect(translationsService.updateRawTranslations).not.toHaveBeenCalled()
  })

  // Comparing English against itself would mark every overridden key as having changed.
  it("collects no English override keys while editing English", async () => {
    translationsService.getRawTranslations.mockResolvedValue([{ key: "a.key", value: "English" }])
    const { result } = renderScope([jurisdiction("first")])

    await waitFor(() => expect(result.current.overrides).toHaveLength(1))
    expect(result.current.englishOverrideKeys.size).toEqual(0)
  })

  it("reports the read's loading and error state", async () => {
    translationsService.getRawTranslations.mockRejectedValue(new Error("boom"))
    const { result } = renderScope([jurisdiction("first")])

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.loading).toBe(false)
  })

  it("collects the English override keys while editing another language", async () => {
    translationsService.getRawTranslations.mockImplementation(({ language }) =>
      Promise.resolve(language === "en" ? [{ key: "a.key", value: "English" }] : [])
    )
    const { result } = renderScope([jurisdiction("first", [LanguagesEnum.en, LanguagesEnum.es])])

    act(() => result.current.setLanguage(LanguagesEnum.es))

    await waitFor(() => expect(result.current.englishOverrideKeys.has("a.key")).toBe(true))
  })
})
