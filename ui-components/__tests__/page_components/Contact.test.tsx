import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Contact } from "../../src/page_components/listing/listing_sidebar/Contact"

afterEach(cleanup)

describe("<Contact>", () => {
  it("renders all props", () => {
    const { getByText } = render(
      <Contact
        sectionTitle={"Contact Leasing Agent"}
        contactTitle={"Contact Title"}
        contactName={"Contact Name"}
        contactEmail={"contact@email.com"}
        contactPhoneNumber={"Call (123) 456 - 7890"}
        contactPhoneNumberNote={"Phone number note"}
        contactCompany={{ name: "Company Name", website: "www.example.com" }}
        strings={{ email: "Email", website: "Website", getDirections: "Get Directions" }}
        contactAddress={{
          street: "Street 1",
          street2: "Street 2",
          city: "City",
          state: "State",
          zipCode: "12345",
        }}
        additionalInformation={[
          { title: "Additional Info 1", content: "Content 1" },
          { title: "Additional Info 2", content: "Content 2" },
        ]}
      />
    )
    expect(getByText("Contact Leasing Agent")).toBeTruthy()
    expect(getByText("Contact Name")).toBeTruthy()
    expect(getByText("Contact Title")).toBeTruthy()
    expect(getByText("Email")).toBeTruthy()
    expect(getByText("Website")).toBeTruthy()
    expect(getByText("Get Directions")).toBeTruthy()
    expect(getByText("Call (123) 456 - 7890")).toBeTruthy()
    expect(getByText("Phone number note")).toBeTruthy()
    expect(getByText("Street 1", { exact: false })).toBeTruthy()
    expect(getByText("Street 2", { exact: false })).toBeTruthy()
    expect(getByText("City", { exact: false })).toBeTruthy()
    expect(getByText("State", { exact: false })).toBeTruthy()
    expect(getByText("12345", { exact: false })).toBeTruthy()
    expect(getByText("Additional Info 1")).toBeTruthy()
    expect(getByText("Additional Info 2")).toBeTruthy()
    expect(getByText("Content 1")).toBeTruthy()
    expect(getByText("Content 2")).toBeTruthy()
  })
})
