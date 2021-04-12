import { render, cleanup, fireEvent } from "@testing-library/react"
import {
  linkDirectlyToInternalApplication,
  hardApplicationDeadline,
  linkDirectlyToExternalApplication,
  linkToInternalApplicationAndDownloads,
} from "../../src/page_components/listing/listing_sidebar/Apply.stories"

afterEach(cleanup)

describe("<Apply>", () => {
  it("can render with a hard application deadline", () => {
    const { getByText } = render(hardApplicationDeadline())
    expect(
      getByText(
        "Applications must be received by the deadline and postmarks will not be considered."
      )
    ).toBeTruthy()
  })
  it("can render with an internal application link", () => {
    const { getByText } = render(linkDirectlyToInternalApplication())
    expect(getByText("Apply Online").closest("a")?.getAttribute("href")).toBe(
      "/applications/start/choose-language?listingId=Uvbk5qurpB2WI9V6WnNdH"
    )
  })
  it("can render with an external application link", () => {
    const { getByText } = render(linkDirectlyToExternalApplication())
    expect(getByText("Apply Online").closest("a")?.getAttribute("href")).toBe("https://icann.org")
  })
  it("can render with a download method", () => {
    const { getByText, queryByText } = render(linkToInternalApplicationAndDownloads())
    expect(queryByText("English")).toBeNull()
    fireEvent.click(getByText("Download Application"))
    expect(getByText("English")).toBeTruthy()
  })
})
