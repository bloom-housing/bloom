describe("applications/contact/address", function () {
  const route = "/applications/contact/address"

  before(() => {
    cy.visit(route)
  })

  it("should render the primary applicant address sub-form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("should require form input", function () {
    cy.goNext()
    cy.checkErrorAlert("be.visible")
    cy.checkErrorMessages("be.visible")
  })

  it("should disable phone number & phone number type fields when user indicates they have no phone number", function () {
    cy.getByTestId("app-primary-no-phone").check()
    cy.getPhoneFieldByTestId("app-primary-phone-number").should("be.disabled")
    cy.getByTestId("app-primary-phone-number-type").should("be.disabled")
    cy.getByTestId("app-primary-additional-phone").should("be.disabled")
    cy.reload()
  })

  it("should provide a way to validate address via API", function () {
    cy.getByTestId("app-primary-no-phone").check()

    cy.getByTestId("app-primary-address-street").type("600 Mongomery St")
    cy.getByTestId("app-primary-address-city").type("San Francisco")
    cy.getByTestId("app-primary-address-state").select("CA")
    cy.getByTestId("app-primary-address-zip").type("94112")

    cy.getByTestId("app-primary-contact-preference").eq(0).check()
    cy.getByTestId("app-primary-work-in-region-no").check()

    cy.goNext()
    cy.getByTestId("app-found-address-label").should("be.visible")
    cy.getByTestId("app-found-address-label").should("include.text", "Montgomery St")
    cy.getByTestId("app-found-address-label").should("include.text", "94111")
    cy.reload()
  })

  it("should handle garbage input", function () {
    cy.getByTestId("app-primary-no-phone").check()

    // Let's add gibberish
    cy.getByTestId("app-primary-address-street").type("l;iaj;ewlijvlij")
    cy.getByTestId("app-primary-address-city").type("San Francisco")
    cy.getByTestId("app-primary-address-state").select("CA")
    cy.getByTestId("app-primary-address-zip").type("oqr8buoi@@hn")

    cy.getByTestId("app-primary-contact-preference").eq(0).check()
    cy.getByTestId("app-primary-work-in-region-no").check()

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.get(`[data-test-id="app-found-address-label"]`).should("not.exist")

    // Let's go back and add other weirdness
    cy.getByTestId("app-edit-original-address").click()
    cy.getByTestId("app-primary-address-street").clear().type("98765 NW 10")
    cy.getByTestId("app-primary-address-zip").clear().type("54321")

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")
    cy.get(`[data-test-id="app-found-address-label"]`).should("not.exist")
  })
})
