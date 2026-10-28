import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { mockNextRouter } from "../testUtils"
import BloomApp from "../../src/pages/_app"

const fetchMock = jest.fn()
const realFetch = global.fetch

const PAGE_MARKER = "page content"

// "/unauthorized" is one of _app's skipForRoutes, so RequireLogin passes through and what is
// left gating the page is the hasMounted && settled check this file exists to cover.
const renderApp = (locale = "en") =>
  render(
    <BloomApp
      Component={() => <div>{PAGE_MARKER}</div>}
      router={
        {
          pathname: "/unauthorized",
          locale,
          query: {},
          asPath: "/unauthorized",
          push: jest.fn(),
          events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
      pageProps={{}}
    />
  )

describe("<BloomApp>", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNextRouter()
    global.fetch = fetchMock as unknown as typeof fetch
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
  })

  afterEach(() => {
    global.fetch = realFetch
  })

  it("renders nothing until the stored overrides settle", () => {
    fetchMock.mockReturnValue(new Promise(() => undefined))
    renderApp()

    // The overrides include strings that appear on every page, so painting first would show the
    // bundled value and then swap it in view.
    expect(screen.queryByText(PAGE_MARKER)).toBeNull()
  })

  it("renders the page once the overrides arrive", async () => {
    renderApp()

    expect(await screen.findByText(PAGE_MARKER)).toBeInTheDocument()
  })

  // The portal has to come up on its bundled strings rather than stay blank.
  it("renders the page when the overrides cannot be loaded", async () => {
    fetchMock.mockRejectedValue(new Error("network down"))
    renderApp()

    expect(await screen.findByText(PAGE_MARKER)).toBeInTheDocument()
  })

  it("renders the page when the overrides request is refused", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: () => Promise.resolve({}) })
    renderApp()

    await waitFor(() => expect(screen.getByText(PAGE_MARKER)).toBeInTheDocument())
  })
})
