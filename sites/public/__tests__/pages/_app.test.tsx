import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { mockNextRouter } from "../testUtils"
import BloomApp from "../../src/pages/_app"
import { overrideTranslations } from "../../src/lib/translations"

// Supplied by the bundled English override file, so a stored override has something to beat.
const BUNDLED_KEY = "account.create.initialDisclaimer"

const Page = () => <div>{t(BUNDLED_KEY)}</div>

const renderApp = (pageProps: Record<string, unknown>, locale = "en") =>
  render(
    <BloomApp
      Component={Page}
      router={
        {
          pathname: "/",
          locale,
          query: {},
          asPath: "/",
          push: jest.fn(),
          events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
      pageProps={pageProps}
    />
  )

describe("<BloomApp>", () => {
  // AuthProvider inside _app calls useRouter, which needs the module mocked.
  beforeEach(() => mockNextRouter())

  // Without this the whole feature is dead: pages fetch the overrides and nothing applies them.
  it("applies the overrides a page supplies", () => {
    renderApp({ publicOverrides: { en: { [BUNDLED_KEY]: "From the database" } } })

    expect(screen.getByText("From the database")).toBeInTheDocument()
  })

  it("renders the bundled value when a page supplies none", () => {
    renderApp({})

    expect(screen.getByText(overrideTranslations.en[BUNDLED_KEY])).toBeInTheDocument()
  })

  it("renders the bundled value when the fetch returned null", () => {
    renderApp({ publicOverrides: null })

    expect(screen.getByText(overrideTranslations.en[BUNDLED_KEY])).toBeInTheDocument()
  })

  it("applies the locale's overrides for a non-English locale", () => {
    renderApp(
      {
        publicOverrides: {
          en: { [BUNDLED_KEY]: "English override" },
          es: { [BUNDLED_KEY]: "Anulación en español" },
        },
      },
      "es"
    )

    expect(screen.getByText("Anulación en español")).toBeInTheDocument()
  })
})
