import React from "react"
import { render } from "@testing-library/react"
import { getAvailabilitySubheading } from "../../../../src/components/listing/listing_sections/Availability"
describe("getAvailabilitySubheading", () => {
  describe("when waitlist is open and unit groups disabled", () => {
    it("returns waitlist fields when waitlistOpenSpots is provided", () => {
      const result = getAvailabilitySubheading(
        50, // waitlistOpenSpots
        0, // unitsAvailable
        undefined, // waitlistCurrentSize
        undefined, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toContain("50 open waitlist slots")
      expect(container.textContent).not.toContain("0 current waitlist size")
      expect(container.textContent).not.toContain("0 final waitlist size")
    })

    it("returns waitlist fields when values are 0 and showAdditionalWaitlistFields is false", () => {
      const result = getAvailabilitySubheading(
        0, // waitlistOpenSpots
        0, // unitsAvailable
        undefined, // waitlistCurrentSize
        0, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).not.toContain("0 current waitlist size")
      expect(container.textContent).toContain("0 open waitlist slots")
      expect(container.textContent).not.toContain("0 final waitlist size")
    })

    it("returns waitlist fields when values are 0 and showAdditionalWaitlistFields is true", () => {
      const result = getAvailabilitySubheading(
        0, // waitlistOpenSpots
        0, // unitsAvailable
        0, // waitlistCurrentSize
        0, // waitlistMaxSize
        true, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toContain("0 current waitlist size")
      expect(container.textContent).toContain("0 open waitlist slots")
      expect(container.textContent).toContain("0 final waitlist size")
    })

    it("shows additional waitlist fields when flag is enabled", () => {
      const result = getAvailabilitySubheading(
        30, // waitlistOpenSpots
        0, // unitsAvailable
        25, // waitlistCurrentSize
        100, // waitlistMaxSize
        true, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toContain("25 current waitlist size")
      expect(container.textContent).toContain("30 open waitlist slots")
      expect(container.textContent).toContain("100 final waitlist size")
    })

    it("only shows open slots when additional fields are disabled", () => {
      const result = getAvailabilitySubheading(
        30, // waitlistOpenSpots
        0, // unitsAvailable
        25, // waitlistCurrentSize
        100, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).not.toContain("25 current waitlist size")
      expect(container.textContent).toContain("30 open waitlist slots")
      expect(container.textContent).not.toContain("100 final waitlist size")
    })

    it("applies bold styling to open slots when additional fields are shown", () => {
      const result = getAvailabilitySubheading(
        30, // waitlistOpenSpots
        0, // unitsAvailable
        25, // waitlistCurrentSize
        100, // waitlistMaxSize
        true, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      const openSlotsElement = container.querySelector(".bold-text")
      expect(openSlotsElement).toBeTruthy()
      expect(openSlotsElement?.textContent).toContain("30 open waitlist slots")
    })
    it("prioritizes waitlist over units when both conditions could be met", () => {
      const result = getAvailabilitySubheading(
        20, // waitlistOpenSpots
        5, // unitsAvailable
        undefined, // waitlistCurrentSize
        undefined, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        true, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toContain("20 open waitlist slots")
      expect(container.textContent).not.toContain("5 units")
    })
  })
})

describe("when unit groups enabled", () => {
  it("does not return waitlist fields", () => {
    const result = getAvailabilitySubheading(
      50, // waitlistOpenSpots
      undefined, // unitsAvailable
      undefined, // waitlistCurrentSize
      undefined, // waitlistMaxSize
      false, // showAdditionalWaitlistFields
      true, // isWaitlistOpen
      true // enableUnitGroups - enabled
    )

    const { container } = render(<div>{result}</div>)
    expect(container.textContent).not.toContain("open waitlist slots")
    expect(container.textContent).not.toContain("units")
  })

  describe("when units are available", () => {
    it("returns singular unit text for 1 unit", () => {
      const result = getAvailabilitySubheading(
        0, // waitlistOpenSpots
        1, // unitsAvailable
        undefined, // waitlistCurrentSize
        undefined, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        false, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toBe("1 unit")
    })

    it("returns plural unit text for multiple units", () => {
      const result = getAvailabilitySubheading(
        0, // waitlistOpenSpots
        5, // unitsAvailable
        undefined, // waitlistCurrentSize
        undefined, // waitlistMaxSize
        false, // showAdditionalWaitlistFields
        false, // isWaitlistOpen
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toBe("5 units")
    })

    it("returns units even when waitlist data exists but conditions not met", () => {
      const result = getAvailabilitySubheading(
        50, // waitlistOpenSpots
        3, // unitsAvailable
        25, // waitlistCurrentSize
        100, // waitlistMaxSize
        true, // showAdditionalWaitlistFields
        false, // isWaitlistOpen - false, so waitlist not shown
        false // enableUnitGroups
      )

      const { container } = render(<div>{result}</div>)
      expect(container.textContent).toBe("3 units")
      expect(container.textContent).not.toContain("waitlist")
    })
  })
})
