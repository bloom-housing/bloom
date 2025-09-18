import React from "react"
import { screen } from "@testing-library/dom"
import { mockNextRouter, render } from "../testUtils"
import AboutPage from "../../src/pages/about"

describe("About", () => {
  beforeEach(() => {
    mockNextRouter()
  })
  it("should render the About page", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument()
    expect(
      screen.getByText(
        "We know that finding housing that meets your needs can be difficult and frustrating. Detroit Home Connect is your helping hand to find a new place to call home."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Detroit Home Connect is a new City of Detroit service that provides you a central first step in finding housing in Detroit that meets your affordability and household needs. You can understand your eligibility for rental units by exploring options based on your family size, age, and income. Detroit Home Connect is an initiative of the City of Detroit’s Housing and Revitalization Department. The design and features of the website is based on feedback and insight from area residents, community-based organizations, property managers, and property owners."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "For more information, please contact City staff at detroithomeconnect@detroitmi.gov."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "The City of Detroit Housing and Revitalization Department would like to thank the following partners for their support and partnership during the development of Detroit Home Connect, including:"
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Exygy, Google.org, City of Detroit Department of Innovation and Technology, City of Detroit Department of Neighborhoods, United Community Housing Coalition, Detroit Disability Power, Independent Management Services, Continental Management, KMG Prestige, Premier Property Management, Elite Management, The Associated Management Company, Ginosko Developement, The Platform, U Snap Bac, Central Detroit Christian CDC, Matrix Human Services, Wayne Metro, Bridging Communities, Southwest Solutions, Legal Aid and Defender Association, Ruth Ellis Center, Neighborhood Legal Services, COTS, Central City Integrated Health, Jefferson East Inc, Invest Detroit, Alternatives for Girls, Cass Community Social Services, and CSI Coop."
      )
    ).toBeInTheDocument()
    expect(screen.getByText("For general questions or website issues")).toBeInTheDocument()
  })
})
