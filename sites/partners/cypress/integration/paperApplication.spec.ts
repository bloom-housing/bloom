describe("Paper Application Tests", () => {
  before(() => {
    cy.login()
  })

  it("navigate to paper listing form", () => {
    cy.get(`[col-id="status"] > a`).eq(1).click()
    cy.getByTestId("addApplicationButton").contains("Add Application").click()
  })

  it("fill paper application form completely", () => {
    cy.fixture("application").then((application) => {
      cy.fillPrimaryApplicant(application)
      cy.fillAlternateContact(application)
      cy.fillHouseholdMember(application)
      cy.fillHouseholdDetails(application)
      cy.fillHouseholdIncome(application)
      cy.fillDemographics(application)
      cy.fillTerms(application, true)
    })
  })

  it("verify application submit", () => {
    cy.fixture("application").then((application) => {
      cy.verifyApplicationData(application)
      cy.verifyPrimaryApplicant(application)
      cy.verifyAlternateContact(application)
      cy.verifyHouseholdMembers(application)
      cy.verifyHouseholdDetails(application)
      cy.verifyHouseholdIncome(application)
      cy.verifyTerms(application)
    })
  })

  it("submit with no data", () => {
    cy.visit("/")
    cy.get(`[col-id="status"] > a`).eq(1).click()
    cy.getByTestId("addApplicationButton").contains("Add Application").click()
    cy.fixture("emptyApplication").then((application) => {
      cy.fillTerms(application, true)
      cy.verifyApplicationData(application)
      cy.verifyPrimaryApplicant(application)
      cy.verifyAlternateContact(application)
      cy.verifyHouseholdDetails(application)
      cy.verifyHouseholdIncome(application)
      cy.verifyTerms(application)
    })
  })

  it("submit different data", () => {
    cy.visit("/")
    cy.get(`[col-id="status"] > a`).eq(1).click()
    cy.getByTestId("addApplicationButton").contains("Add Application").click()
    cy.fixture("partialApplicationA").then((application) => {
      cy.fillMailingAddress(application)
      cy.fillHouseholdIncome(application, ["incomeMonth"])
      cy.fillTerms(application, true)
      cy.verifyApplicationData(application)
      cy.verifyPrimaryApplicant(application)
      cy.verifyAlternateContact(application)
      cy.verifyHouseholdDetails(application)
      cy.verifyHouseholdIncome(application)
      cy.verifyTerms(application)
    })
  })
})
