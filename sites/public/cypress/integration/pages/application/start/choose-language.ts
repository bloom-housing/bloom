import { listingsUrl } from "../../../../support/helpers"

describe("Form contact/name", function () {
  it("Should redirect to the homepage when there is no listingId parameter", function () {
    cy.visit("/applications/start/choose-language")
    cy.location("pathname").should("equal", "/")
  })

  it("Should render language buttons and move to the next step", function () {
    // get the first listing id from the backend
    cy.request("GET", listingsUrl).then(({ body }) => {
      const listingId = body.items[0].id

      cy.visit(`/applications/start/choose-language?listingId=${listingId}`)
      cy.get(".language-select").first().click()
      cy.location("pathname").should("include", "/applications/start/what-to-expect")
    })
  })

  it("Should select first language and check saved language in the context", function () {
    // get the first listing id from the backend
    cy.request("GET", listingsUrl).then(({ body }) => {
      const listingId = body.items[0].id

      cy.visit(`/applications/start/choose-language?listingId=${listingId}`)
      cy.get(".language-select").first().click()

      cy.getSubmissionContext().its("language").should("equal", "en")
    })
  })
})
