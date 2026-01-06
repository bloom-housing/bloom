import React from "react"
import { render, screen } from "@testing-library/react"
import { Address } from "../../src/utilities/Address"
import { Address as AddressType } from "../../src/types/backend-swagger"

describe("Address component integration tests", () => {
  const baseAddress = {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
  } as AddressType

  describe("Rendering without getDirections", () => {
    it("should render address without placeName or street2", () => {
      const { container } = render(<Address address={baseAddress} />)

      expect(screen.getByText("123 Main St")).toBeInTheDocument()
      expect(screen.getByText("San Francisco, CA 94102")).toBeInTheDocument()
      expect(container.querySelector("a")).not.toBeInTheDocument()
    })

    it("should render address with street2", () => {
      const addressWithStreet2 = {
        ...baseAddress,
        street2: "Apt 4B",
      } as AddressType

      render(<Address address={addressWithStreet2} />)

      expect(screen.getByText("123 Main St, Apt 4B")).toBeInTheDocument()
      expect(screen.getByText("San Francisco, CA 94102")).toBeInTheDocument()
    })

    it("should render address with placeName", () => {
      const addressWithPlaceName = {
        ...baseAddress,
        placeName: "City Hall",
      } as AddressType

      render(<Address address={addressWithPlaceName} />)

      expect(screen.getByText("City Hall")).toBeInTheDocument()
      expect(screen.getByText("123 Main St")).toBeInTheDocument()
      expect(screen.getByText("San Francisco, CA 94102")).toBeInTheDocument()
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
        "https://www.google.com/maps/place/123 Main St, San Francisco, CA 94102"
      )
    })

    it("should render get directions link with street2", () => {
      const addressWithStreet2: AddressType = {
        ...baseAddress,
        street2: "Apt 4B",
      }

      render(<Address address={addressWithStreet2} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/123 Main St, Apt 4B, San Francisco, CA 94102"
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
        "https://www.google.com/maps/place/123 Main St, San Francisco, CA 94102"
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

  describe("Address structure and layout", () => {
    it("should render address parts in separate divs when placeName exists", () => {
      const addressWithPlaceName = {
        placeName: "Test Building",
        street: "100 Test St",
        city: "Test City",
        state: "TC",
        zipCode: "12345",
      } as AddressType

      const { container } = render(<Address address={addressWithPlaceName} />)
      const divs = container.querySelectorAll("div")

      expect(divs.length).toBeGreaterThan(0)
      expect(screen.getByText("Test Building")).toBeInTheDocument()
      expect(screen.getByText("100 Test St")).toBeInTheDocument()
      expect(screen.getByText("Test City, TC 12345")).toBeInTheDocument()
    })

    it("should handle empty street2 correctly", () => {
      const addressWithEmptyStreet2 = {
        street: "200 Test Ave",
        street2: "",
        city: "Test Town",
        state: "TT",
        zipCode: "54321",
      } as AddressType

      render(<Address address={addressWithEmptyStreet2} />)

      expect(screen.getByText("200 Test Ave")).toBeInTheDocument()
      expect(screen.queryByText("200 Test Ave,")).not.toBeInTheDocument()
    })

    it("should format city, state, and zipCode with proper spacing", () => {
      render(<Address address={baseAddress} />)

      expect(screen.getByText("San Francisco, CA 94102")).toBeInTheDocument()
    })
  })

  describe("Google Maps URL encoding", () => {
    it("should create valid Google Maps URL with spaces", () => {
      const addressWithSpaces = {
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
      } as AddressType

      render(<Address address={addressWithSpaces} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/123 Main Street, San Francisco, CA 94102"
      )
    })

    it("should handle addresses with special characters", () => {
      const addressWithSpecialChars = {
        street: "123 O'Connor St",
        city: "San José",
        state: "CA",
        zipCode: "95110",
      } as AddressType

      render(<Address address={addressWithSpecialChars} getDirections={true} />)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute(
        "href",
        "https://www.google.com/maps/place/123 O'Connor St, San José, CA 95110"
      )
    })
  })
})
