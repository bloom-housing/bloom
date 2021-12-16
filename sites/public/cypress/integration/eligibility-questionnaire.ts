describe("Verifying the eligibility questionnaire flow", () => {
  it("Clicks the button on the homepage to launch the eligibility questionnaire", () => {
    cy.visit("/")

    // Find and click the button that says "Do I Qualify"
    const checkEligibilityButton = cy.contains("Do I Qualify")

    // Click the eligibility button and verify it takes us to the questionnaire welcome page
    checkEligibilityButton.click()
    cy.url().should("include", "/eligibility/welcome")
  })

  it("Navigates through the eligibility questionnaire flow", () => {
    cy.visit("/eligibility/welcome")

    // Click the "Next" button to go to the "Household Size" section.
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/household")

    // Select "Household Size 2"
    cy.get("select").select("two")

    // Click "Next" to go to the "Age" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/age")

    // Select "< 55" for the age input.
    cy.get("#ageLessThan55").click()

    // Click "Next" to go to the "Disability" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/disability")

    // Click "no" to indicate no disability.
    cy.get("#disabilityNo").click()

    // Click "Next" to go to the "Accessibility" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/accessibility")

    // Click "Next" to go to the "Income" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/income")

    // Select "$30k to $40k"
    cy.get("#30kTo40k").click()

    // Click "Finish"
    cy.contains("Finish").click()
    cy.url().should("include", "/eligibility/disclaimer")

    cy.contains("View Listings").click()
    cy.url().should("include", "/listings")
  })

  // TODO: consider adding tests for incorrect inputs in the Eligibility Questionnaire.
  // Example: A user enters an age of 999 and clicks "Next".
})
