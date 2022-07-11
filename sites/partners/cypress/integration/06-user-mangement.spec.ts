describe("User Mangement Tests", () => {
  it("as admin user, should show all users regardless of jurisdiction", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Administrator", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100")

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })

    cy.signOut()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    cy.loginAndAcceptTerms("jurisdictionalAdmin")
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100")

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
    cy.signOut()
  })
})
