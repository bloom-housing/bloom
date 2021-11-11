import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Waitlist } from "../../src/page_components/listing/listing_sidebar/Waitlist"

afterEach(cleanup)

describe("<Waitlist>", () => {
  it("renders with a closed waitlist", () => {
    const { container } = render(
      <Waitlist
        isWaitlistOpen={false}
        waitlistMaxSize={500}
        waitlistCurrentSize={300}
        waitlistOpenSpots={200}
      />
    )
    expect(container.innerHTML).toEqual("")
  })
  it("renders with an open waitlist", () => {
    const { getByText } = render(
      <Waitlist
        isWaitlistOpen={true}
        waitlistMaxSize={100}
        waitlistCurrentSize={40}
        waitlistOpenSpots={60}
      />
    )
    expect(getByText("Available Units and Waitlist")).toBeTruthy()
    expect(getByText("Current Waitlist Size"))
    expect(getByText("40")).toBeTruthy()
    expect(getByText("Open Waitlist Slots"))
    expect(getByText("60")).toBeTruthy()
    expect(getByText("Final Waitlist Size"))
    expect(getByText("100")).toBeTruthy()
    expect(
      getByText(
        "Once ranked applicants fill all available units, the remaining ranked applicants will be placed on a waitlist for those same units."
      )
    ).toBeTruthy()
  })
  it("renders with open spots", () => {
    const { getByText } = render(
      <Waitlist
        isWaitlistOpen={true}
        waitlistMaxSize={10}
        waitlistCurrentSize={0}
        waitlistOpenSpots={10}
      />
    )
    expect(
      getByText(
        "Once ranked applicants fill all available units, the remaining ranked applicants will be placed on a waitlist for those same units."
      )
    ).toBeTruthy()
  })
})
