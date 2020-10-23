describe("applications/review/summary", function () {
  const route = "/applications/review/summary"

  beforeEach(() => {
    cy.fixture("applications/summary.json").as("data")
  })

  it("Should render 'You' section and check displaled values", function () {
    cy.loadConfig({}, "filledApplication.json")
    cy.visit(route)

    cy.getByID("applicantName").should("include.text", this.data.you.name)
    cy.getByID("applicantbirthDay").should("include.text", this.data.you.dateOfBirth)

    cy.getByID("applicantPhone").should("include.text", this.data.you.workPhone)
    cy.getByID("applicantPhone").should("include.text", this.data.you.workPhoneLabel)

    cy.getByID("applicantPhone").should("include.text", this.data.you.workPhone)
    cy.getByID("applicantPhone").should("include.text", this.data.you.workPhoneLabel)

    cy.getByID("applicantAdditionalPhone").should("include.text", this.data.you.homePhone)
    cy.getByID("applicantAdditionalPhone").should("include.text", this.data.you.homePhoneLabel)
  })
})
