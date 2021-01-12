describe("Form contact/name", function () {
  beforeEach(() => {
    cy.visit("/applications/start/choose-language")
  })

  it("should render language buttons", function () {
    cy.get("form").should("be.visible")

    cy.get("form button").should("be.visible")
  })

  it("should init application and move to the next step", function () {
    cy.get(".language-select").first().click()
    cy.location("pathname").should("include", "/applications/start/what-to-expect")
  })
})
