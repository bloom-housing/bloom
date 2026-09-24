/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { screen } from "@testing-library/dom"
import { mockNextRouter, render } from "../../testUtils"
import ContactCard from "../../../src/components/shared/ContactCard"

describe("<ContactCard>", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  it("renders the contact card when supplied content", () => {
    const address = "123 Main St"
    const contactDescription = "Contact description"
    const contactInfo = "Contact information"
    const email = "housing@example.gov"
    const heading = "Contact heading"
    const hours = "Mon to Fri"
    const phone = "555-0100"

    render(
      <ContactCard
        address={<p>{address}</p>}
        contactDescription={contactDescription}
        contactInfo={contactInfo}
        email={email}
        heading={heading}
        hours={hours}
        phone={phone}
      />
    )

    expect(screen.getByText(address)).toBeInTheDocument()
    expect(screen.getByText(contactDescription)).toBeInTheDocument()
    expect(screen.getByText(contactInfo)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: email })).toHaveAttribute("href", `mailto:${email}`)
    expect(screen.getByText(heading)).toBeInTheDocument()
    expect(screen.getByText(hours)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: phone })).toHaveAttribute("href", `tel:${phone}`)
  })

  it("renders the contact card with heading as a react node", () => {
    const heading = "Contact heading"

    render(<ContactCard heading={<p>{heading}</p>} />)

    expect(screen.getByText(heading)).toBeInTheDocument()
  })

  it("renders the contact card with description as a react node", () => {
    const contactDescription = "Contact description"

    render(<ContactCard contactDescription={<p>{contactDescription}</p>} />)

    expect(screen.getByText(contactDescription)).toBeInTheDocument()
  })
})
