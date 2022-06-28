describe("User Mangement Tests", () => {
  it("as admin user, should show all users regadless of jurisdiction", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = [
      "Partner",
      "Partner",
      "Administrator",
      "Administrator",
      "Jurisdictional Admin",
    ]
    cy.get(`.ag-center-cols-container [row-id="0"] [col-id="roles"]`)
      .contains(rolesArray[0])
      .should("have.text", rolesArray[0])
    cy.get(`.ag-center-cols-container [row-id="1"] [col-id="roles"]`)
      .contains(rolesArray[1])
      .should("have.text", rolesArray[1])
    cy.get(`.ag-center-cols-container [row-id="2"] [col-id="roles"]`)
      .contains(rolesArray[2])
      .should("have.text", rolesArray[2])
    cy.get(`.ag-center-cols-container [row-id="3"] [col-id="roles"]`)
      .contains(rolesArray[3])
      .should("have.text", rolesArray[3])
    cy.get(`.ag-center-cols-container [row-id="4"] [col-id="roles"]`)
      .contains(rolesArray[4])
      .should("have.text", rolesArray[4])
    cy.signOut()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    cy.login("jurisdictionalAdmin")
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Partner", "Jurisdictional Admin"]
    cy.get(`.ag-center-cols-container [row-id="0"] [col-id="roles"]`)
      .contains(rolesArray[0])
      .should("have.text", rolesArray[0])
    cy.get(`.ag-center-cols-container [row-id="1"] [col-id="roles"]`)
      .contains(rolesArray[1])
      .should("have.text", rolesArray[1])
    cy.get(`.ag-center-cols-container [row-id="2"] [col-id="roles"]`)
      .contains(rolesArray[2])
      .should("have.text", rolesArray[2])
    cy.signOut()
  })
})
