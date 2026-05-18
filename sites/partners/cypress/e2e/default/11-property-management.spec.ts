describe("Property Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  it("as admin user, should be able to create, edit, and delete a property", () => {
    const propertyName = `Test Property ${Date.now()}`
    const updatedPropertyName = `${propertyName} Updated`

    cy.visit("/settings/preferences")
    cy.contains("a", "Properties").should("be.visible").click()
    cy.location("pathname").should("eq", "/settings/properties")

    cy.getByID("addListingButton").click()
    cy.getByID("name").type(propertyName)
    cy.getByID("description").type("Property created by Cypress")
    cy.getByID("url").type("https://example.com")
    cy.getByID("urlTitle").type("Example property")
    cy.get("body").then(($body) => {
      const jurisdictionValue = $body.find("#jurisdiction option").eq(1).val()
      if (jurisdictionValue) {
        cy.getByID("jurisdiction").select(jurisdictionValue as string)
      }
    })
    cy.getByID("property-save-button").click()
    cy.getByTestId("toast-alert")
      .contains("Property created")
      .should("have.text", "Property created")

    cy.getByTestId("ag-search-input").clear().type(propertyName)
    cy.getByTestId(`property-edit-icon: ${propertyName}`).should("be.enabled").click()
    cy.getByID("name").should("have.value", propertyName).clear().type(updatedPropertyName)
    cy.getByID("property-save-button").click()
    cy.getByTestId("toast-alert")
      .contains("Property updated")
      .should("have.text", "Property updated")

    cy.getByTestId(`property-delete-icon: ${updatedPropertyName}`).should("be.enabled").click()
    cy.get('[aria-labelledby="property-delete-modal-header"]')
      .should("be.visible")
      .within(() => {
        cy.get("button").contains("Delete").click()
      })
    cy.getByTestId("toast-alert")
      .contains("Property removed")
      .should("have.text", "Property removed")
    cy.contains(updatedPropertyName).should("not.exist")
  })
})
