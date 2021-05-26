describe("My applications page", function () {
  it("renders the my applications page", function () {
    cy.visit("/account/applications")
    cy.getByID("email").type("admin@example.com")
    cy.getByID("password").type("abcdef")
    cy.get("button").contains("Sign In").click()
    cy.url().should("include", "/account/dashboard")
    cy.visit("/account/applications")
    cy.contains("My Applications")
  })
})
