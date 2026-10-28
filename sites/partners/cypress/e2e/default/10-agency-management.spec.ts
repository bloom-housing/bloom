describe("Agency Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  it("as admin user, should be able to create, edit, and delete an agency", () => {
    const agencyName = `Test Agency ${Date.now()}`
    const updatedAgencyName = `${agencyName} Updated`

    cy.visit("/settings/preferences")
    cy.contains("a", "Agencies").should("be.visible").click()
    cy.location("pathname").should("eq", "/settings/agencies")

    cy.getByID("addAgencyButton").click()
    cy.getByID("name").type(agencyName)
    cy.get("body").then(($body) => {
      const jurisdictionValue = $body.find("#jurisdiction option").eq(1).val()
      if (jurisdictionValue) {
        cy.getByID("jurisdiction").select(jurisdictionValue as string)
      }
    })
    cy.getByID("agency-save-button").click()
    cy.getByTestId("toast-alert").contains("Agency created").should("have.text", "Agency created")

    cy.getByTestId("ag-search-input").clear().type(agencyName)
    cy.getByTestId(`agency-edit-icon: ${agencyName}`).should("be.enabled").click()
    cy.getByID("name").should("have.value", agencyName).clear().type(updatedAgencyName)
    cy.getByID("agency-save-button").click()
    cy.getByTestId("toast-alert").contains("Agency updated").should("have.text", "Agency updated")

    cy.getByTestId(`agency-delete-icon: ${updatedAgencyName}`).should("be.enabled").click()
    cy.get('[aria-labelledby="agency-delete-modal-header"]')
      .should("be.visible")
      .within(() => {
        cy.get("button").contains("Delete").click()
      })
    cy.getByTestId("toast-alert").contains("Agency removed").should("have.text", "Agency removed")
    cy.contains(updatedAgencyName).should("not.exist")
  })
})
