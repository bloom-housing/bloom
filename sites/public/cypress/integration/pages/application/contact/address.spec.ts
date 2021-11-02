// STEP 2
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
})
