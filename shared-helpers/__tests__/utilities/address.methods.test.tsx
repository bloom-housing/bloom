import React from "react"
import { cleanup, render } from "@testing-library/react"
import { oneLineAddress, multiLineAddress } from "../../src/utilities/Address"
import { Address as AddressType } from "../../src/types/backend-swagger"

afterEach(cleanup)

const street = "Mile Drive"
const street2 = "The Lone Cypress"
const city = "Pebble Beach"
const zipCode = "93953"
const state = "CA"

describe("oneLineAddress", () => {
  it("should return empty string for null address", () => {
    expect(oneLineAddress(null)).toBe("")
  })

  it("should format address without street2 property", () => {
    const address = {
      street,
      city,
      state,
      zipCode,
    } as AddressType
    expect(oneLineAddress(address)).toBe("Mile Drive, Pebble Beach, CA 93953")
  })

  it("should format address with street2", () => {
    const address = {
      street,
      street2,
      city,
      state,
      zipCode,
    } as AddressType
    expect(oneLineAddress(address)).toBe("Mile Drive, The Lone Cypress, Pebble Beach, CA 93953")
  })

  it("should format address with empty street2", () => {
    const address = {
      street,
      street2: "",
      city,
      state,
      zipCode,
    } as AddressType
    expect(oneLineAddress(address)).toBe("Mile Drive, Pebble Beach, CA 93953")
  })

  it("should format address with all fields including placeName", () => {
    const address = {
      placeName: "Building A",
      street,
      street2,
      city,
      state,
      zipCode,
    } as AddressType
    expect(oneLineAddress(address)).toBe("Mile Drive, The Lone Cypress, Pebble Beach, CA 93953")
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
      street,
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Mile Drive</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with street2 but without placeName", () => {
    const address = {
      street,
      street2,
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Mile Drive, The Lone Cypress</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with placeName but without street2", () => {
    const address = {
      placeName: "Building A",
      street,
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Building A</span>
        <span>Mile Drive</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with both placeName and street2", () => {
    const address = {
      placeName: "Building A",
      street,
      street2,
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Building A</span>
        <span>Mile Drive, The Lone Cypress</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with empty street2", () => {
    const address = {
      street,
      street2: "",
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Mile Drive</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })

  it("should format address with empty placeName", () => {
    const address: AddressType = {
      placeName: "",
      street,
      city,
      state,
      zipCode,
    } as AddressType
    const { container: resultContainer } = render(<>{multiLineAddress(address)}</>)
    const { container: expectedContainer } = render(
      <>
        <span>Mile Drive</span>
        <span>Pebble Beach, CA 93953</span>
      </>
    )
    expect(resultContainer.innerHTML).toBe(expectedContainer.innerHTML)
  })
})
