import React from "react"
import { cleanup } from "@testing-library/react"
import { oneLineAddress, multiLineAddress } from "../../src/utilities/Address"
import { Address as AddressType } from "../../src/types/backend-swagger"

afterEach(cleanup)

describe("oneLineAddress", () => {
  it("should return empty string for null address", () => {
    expect(oneLineAddress(null)).toBe("")
  })

  it("should return empty string for undefined address", () => {
    expect(oneLineAddress(undefined)).toBe("")
  })

  it("should format address without street2", () => {
    const address: AddressType = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    }
    expect(oneLineAddress(address)).toBe("123 Main St, San Francisco, CA 94102")
  })

  it("should format address with street2", () => {
    const address: AddressType = {
      street: "123 Main St",
      street2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    }
    expect(oneLineAddress(address)).toBe("123 Main St, Apt 4B, San Francisco, CA 94102")
  })

  it("should format address with empty street2", () => {
    const address: AddressType = {
      street: "456 Oak Ave",
      street2: "",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    }
    expect(oneLineAddress(address)).toBe("456 Oak Ave, Los Angeles, CA 90001")
  })

  it("should format address with all fields including placeName", () => {
    const address: AddressType = {
      placeName: "Building A",
      street: "789 Pine Rd",
      street2: "Suite 200",
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
    }
    expect(oneLineAddress(address)).toBe("789 Pine Rd, Suite 200, Oakland, CA 94612")
  })
})

describe("multiLineAddress", () => {
  it("should return empty fragment for null address", () => {
    expect(multiLineAddress(null)).toStrictEqual(<></>)
  })

  it("should return empty fragment for undefined address", () => {
    expect(multiLineAddress(undefined)).toStrictEqual(<></>)
  })

  it("should format address without placeName or street2", () => {
    const address: AddressType = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        {undefined}
        <span>123 Main St</span>
        <span>San Francisco, CA 94102</span>
      </>
    )
  })

  it("should format address with street2 but without placeName", () => {
    const address: AddressType = {
      street: "123 Main St",
      street2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        {undefined}
        <span>123 Main St, Apt 4B</span>
        <span>San Francisco, CA 94102</span>
      </>
    )
  })

  it("should format address with placeName but without street2", () => {
    const address: AddressType = {
      placeName: "Building A",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        <span>Building A</span>
        <span>456 Oak Ave</span>
        <span>Los Angeles, CA 90001</span>
      </>
    )
  })

  it("should format address with both placeName and street2", () => {
    const address: AddressType = {
      placeName: "Building A",
      street: "789 Pine Rd",
      street2: "Suite 200",
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        <span>Building A</span>
        <span>789 Pine Rd, Suite 200</span>
        <span>Oakland, CA 94612</span>
      </>
    )
  })

  it("should format address with empty street2", () => {
    const address: AddressType = {
      street: "321 Elm St",
      street2: "",
      city: "Berkeley",
      state: "CA",
      zipCode: "94704",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        {undefined}
        <span>321 Elm St</span>
        <span>Berkeley, CA 94704</span>
      </>
    )
  })

  it("should format address with empty placeName", () => {
    const address: AddressType = {
      placeName: "",
      street: "555 Cedar Ln",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
    }
    expect(multiLineAddress(address)).toStrictEqual(
      <>
        {""}
        <span>555 Cedar Ln</span>
        <span>San Jose, CA 95110</span>
      </>
    )
  })
})
