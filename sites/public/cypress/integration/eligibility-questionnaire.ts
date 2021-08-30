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

    // Click the "Next" button to go to the "Bedrooms" section.
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/bedrooms")

    // Find and click to indicate both 2BR and 3BR
    cy.get("#twoBdrm").click()
    cy.get("#threeBdrm").click()

    // Click "Next" to go to the "Age" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/age")

    // Enter "55" for the age input.
    cy.get("input").type("55")

    // Click "Next" to go to the "Disability" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/disability")

    // Click "no" to indicate no disability.
    cy.get("#disabilityNo").click()

    // Click "Next" to go to the "Income" section
    cy.contains("Next").click()
    cy.url().should("include", "/eligibility/income")

    // Select "$30k to $40k"
    cy.get("select").select("30kTo40k")

    // Click "Done"
    cy.contains("Done").click()

    // TODO: once the "Done" button is implemented, verify that it takes the user to the correct
    // view.
  })

  // TODO: consider adding tests for incorrect inputs in the Eligibility Questionnaire.
  // Example: A user enters an age of 999 and clicks "Next".
})
