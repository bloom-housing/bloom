import React from "react"
import { cleanup, render } from "@testing-library/react"
import { oneLineAddress, multiLineAddress } from "../../src/utilities/Address"
import { Address as AddressType } from "../../src/types/backend-swagger"

afterEach(cleanup)

describe("oneLineAddress", () => {
  it("should return empty string for null address", () => {
    expect(oneLineAddress(null)).toBe("")
  })

  it("should format address without street2", () => {
    const address = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    } as AddressType
    expect(oneLineAddress(address)).toBe("123 Main St, San Francisco, CA 94102")
  })

  it("should format address with street2", () => {
    const address = {
      street: "123 Main St",
      street2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    } as AddressType
    expect(oneLineAddress(address)).toBe("123 Main St, Apt 4B, San Francisco, CA 94102")
  })

  it("should format address with empty street2", () => {
    const address = {
      street: "456 Oak Ave",
      street2: "",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    } as AddressType
    expect(oneLineAddress(address)).toBe("456 Oak Ave, Los Angeles, CA 90001")
  })

  it("should format address with all fields including placeName", () => {
    const address = {
      placeName: "Building A",
      street: "789 Pine Rd",
      street2: "Suite 200",
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
    } as AddressType
    expect(oneLineAddress(address)).toBe("789 Pine Rd, Suite 200, Oakland, CA 94612")
  })
})

describe("multiLineAddress", () => {
  it("should return empty fragment for null address", () => {
    const { container: resultContainer } = render(<>{multiLineAddress(null)}</>)
    const { container: expectedContainer } = render(<></>)
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address without placeName or street2", () => {
    const address = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>123 Main St</span>
        <span>San Francisco, CA 94102</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with street2 but without placeName", () => {
    const address = {
      street: "123 Main St",
      street2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>123 Main St, Apt 4B</span>
        <span>San Francisco, CA 94102</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with placeName but without street2", () => {
    const address = {
      placeName: "Building A",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Building A</span>
        <span>456 Oak Ave</span>
        <span>Los Angeles, CA 90001</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with both placeName and street2", () => {
    const address = {
      placeName: "Building A",
      street: "789 Pine Rd",
      street2: "Suite 200",
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Building A</span>
        <span>789 Pine Rd, Suite 200</span>
        <span>Oakland, CA 94612</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with empty street2", () => {
    const address = {
      street: "321 Elm St",
      street2: "",
      city: "Berkeley",
      state: "CA",
      zipCode: "94704",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>321 Elm St</span>
        <span>Berkeley, CA 94704</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with empty placeName", () => {
    const address: AddressType = {
      placeName: "",
      street: "555 Cedar Ln",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>555 Cedar Ln</span>
        <span>San Jose, CA 95110</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })
})
