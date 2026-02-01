import React from "react"
import { Property, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render, screen, within } from "../../testUtils"
import { PropertyEditModal } from "../../../src/components/settings/PropertyEditModal"

beforeAll(() => {
  mockNextRouter()
})

const mockProperty: Property = {
  id: "property1",
  name: "Test Property",
  description: "Test Description",
  url: "http://example.com",
  urlTitle: "Example",
  createdAt: new Date(),
  updatedAt: new Date(),
  jurisdictions: {
    id: "jurisdiction1",
    name: "Jurisdiction 1",
  },
}

const mockListingWithProperty: Listing = {
  id: "listing1",
  name: "Test Listing",
  property: mockProperty,
} as Listing

const mockListingWithoutProperty: Listing = {
  id: "listing2",
  name: "Other Listing",
  property: null,
} as Listing

describe("Testing the PropertyEditModal component", () => {
  it("should call onEdit immediately when no listings are associated with the property", () => {
    const onClose = jest.fn()
    const onEdit = jest.fn()

    render(
      <PropertyEditModal property={mockProperty} listings={[]} onClose={onClose} onEdit={onEdit} />
    )

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should call onEdit when listings exist but none are associated with the property", () => {
    const onClose = jest.fn()
    const onEdit = jest.fn()

    render(
      <PropertyEditModal
        property={mockProperty}
        listings={[mockListingWithoutProperty]}
        onClose={onClose}
        onEdit={onEdit}
      />
    )

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should show warning modal when listings are associated with the property", () => {
    const onClose = jest.fn()
    const onEdit = jest.fn()

    render(
      <PropertyEditModal
        property={mockProperty}
        listings={[mockListingWithProperty]}
        onClose={onClose}
        onEdit={onEdit}
      />
    )

    expect(onEdit).not.toHaveBeenCalled()

    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()

    expect(
      within(dialog).getByRole("heading", { name: /changes required before editing/i })
    ).toBeInTheDocument()

    expect(
      within(dialog).getByText(
        /this property is already attached to a listing and needs to be removed before it can be edited/i
      )
    ).toBeInTheDocument()

    expect(within(dialog).getByText("Test Listing")).toBeInTheDocument()
    expect(within(dialog).getByRole("link", { name: "Test Listing" })).toHaveAttribute(
      "href",
      "/listings/listing1"
    )
  })

  it("should show multiple listings in the table when multiple are associated", () => {
    const onClose = jest.fn()
    const onEdit = jest.fn()

    const anotherListingWithProperty: Listing = {
      id: "listing3",
      name: "Another Listing",
      property: mockProperty,
    } as Listing

    render(
      <PropertyEditModal
        property={mockProperty}
        listings={[mockListingWithProperty, anotherListingWithProperty, mockListingWithoutProperty]}
        onClose={onClose}
        onEdit={onEdit}
      />
    )

    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByText("Test Listing")).toBeInTheDocument()
    expect(within(dialog).getByText("Another Listing")).toBeInTheDocument()
    expect(within(dialog).queryByText("Other Listing")).not.toBeInTheDocument()
  })

  it("should not render dialog when property is null", () => {
    const onClose = jest.fn()
    const onEdit = jest.fn()

    render(
      <PropertyEditModal
        property={null}
        listings={[mockListingWithProperty]}
        onClose={onClose}
        onEdit={onEdit}
      />
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
