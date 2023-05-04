import React from "react"
import { render, cleanup } from "@testing-library/react"
import EventSection, {
  EventType,
} from "../../src/page_components/listing/listing_sidebar/events/EventSection"

afterEach(cleanup)

describe("<EventSection>", () => {
  it("renders strings", () => {
    const events: EventType[] = [
      {
        dateString: "November 22, 2022",
        timeString: "10:00am - 11:00am",
        linkURL: "https://www.exygy.com",
        linkText: "See Video",
        note: "Custom note",
      },
    ]
    const { getByText } = render(<EventSection events={events} />)
    expect(getByText("November 22, 2022")).toBeTruthy()
    expect(getByText("10:00am - 11:00am")).toBeTruthy()
    expect(getByText("See Video")).toBeTruthy()
    expect(getByText("Custom note")).toBeTruthy()
  })
})
