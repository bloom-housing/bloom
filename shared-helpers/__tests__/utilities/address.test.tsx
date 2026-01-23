import React from "react"
import { render, screen } from "@testing-library/react"
import { Address } from "../../src/utilities/Address"
import { Address as AddressType } from "../../src/types/backend-swagger"

describe("Address component integration tests", () => {
  const baseAddress = {
    street: "Mile Drive",
    city: "Pebble Beach",
    state: "CA",
    zipCode: "93953",
  } as AddressType

  describe("Rendering without getDirections property", () => {
    it("should render address without placeName or street2", () => {
      const { container } = render(<Address address={baseAddress} />)

      expect(screen.getByText("Mile Drive")).toBeInTheDocument()
      expect(screen.getByText("Pebble Beach, CA 93953")).toBeInTheDocument()
      expect(container.querySelector("a")).not.toBeInTheDocument()
    })

    it("should render address with street2", () => {
      const addressWithStreet2 = {
        ...baseAddress,
        street2: "The Lone Cypress",
      } as AddressType

      render(<Address address={addressWithStreet2} />)

      expect(screen.getByText("Mile Drive, The Lone Cypress")).toBeInTheDocument()
      expect(screen.getByText("Pebble Beach, CA 93953")).toBeInTheDocument()
    })

    it("should render address with placeName", () => {
      const addressWithPlaceName = {
        ...baseAddress,
        placeName: "City Hall",
      } as AddressType

      render(<Address address={addressWithPlaceName} />)

      expect(screen.getByText("City Hall")).toBeInTheDocument()
      expect(screen.getByText("Mile Drive")).toBeInTheDocument()
      expect(screen.getByText("Pebble Beach, CA 93953")).toBeInTheDocument()
    })

    it("should render address with both placeName and street2", () => {
      const fullAddress = {
        placeName: "Municipal Building",
        street: "456 Oak Ave",
        street2: "Suite 200",
        city: "Oakland",
        state: "CA",
        zipCode: "94612",
      } as AddressType

      render(<Address address={fullAddress} />)

      expect(screen.getByText("Municipal Building")).toBeInTheDocument()
      expect(screen.getByText("456 Oak Ave, Suite 200")).toBeInTheDocument()
      expect(screen.getByText("Oakland, CA 94612")).toBeInTheDocument()
    })

    it("should render nothing for null address", () => {
      const { container } = render(<Address address={null} />)

      expect(container.firstChild).toBeNull()
    })

    it("should render nothing for undefined address", () => {
      const { container } = render(<Address address={undefined} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe("Rendering with getDirections", () => {
    it("should render get directions link for basic address", () => {
      render(<Address address={baseAddress} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/Mile Drive, Pebble Beach, CA 93953"
      )
    })

    it("should render get directions link with street2", () => {
      const addressWithStreet2: AddressType = {
        ...baseAddress,
        street2: "The Lone Cypress",
      }

      render(<Address address={addressWithStreet2} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/Mile Drive, The Lone Cypress, Pebble Beach, CA 93953"
      )
    })

    it("should render get directions link with placeName (placeName not included in URL)", () => {
      const addressWithPlaceName: AddressType = {
        ...baseAddress,
        placeName: "City Hall",
      }

      render(<Address address={addressWithPlaceName} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/Mile Drive, Pebble Beach, CA 93953"
      )
    })

    it("should render complete address with directions link", () => {
      const fullAddress = {
        placeName: "Municipal Building",
        street: "789 Pine Rd",
        street2: "Floor 3",
        city: "Berkeley",
        state: "CA",
        zipCode: "94704",
      } as AddressType

      render(<Address address={fullAddress} getDirections={true} />)

      expect(screen.getByText("Municipal Building")).toBeInTheDocument()
      expect(screen.getByText("789 Pine Rd, Floor 3")).toBeInTheDocument()
      expect(screen.getByText("Berkeley, CA 94704")).toBeInTheDocument()

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/789 Pine Rd, Floor 3, Berkeley, CA 94704"
      )

      expect(link.parentElement).toHaveClass("seeds-m-bs-text")
    })

    it("should not render directions link when getDirections is false", () => {
      const { container } = render(<Address address={baseAddress} getDirections={false} />)

      expect(container.querySelector("a")).not.toBeInTheDocument()
    })

    it("should not render directions link when getDirections is undefined", () => {
      const { container } = render(<Address address={baseAddress} />)

      expect(container.querySelector("a")).not.toBeInTheDocument()
    })

    it("should not render directions link for null address even with getDirections true", () => {
      const { container } = render(<Address address={null} getDirections={true} />)

      expect(container.querySelector("a")).not.toBeInTheDocument()
    })
  })
})
