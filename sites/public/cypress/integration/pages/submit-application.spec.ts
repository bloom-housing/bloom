describe("Submit", function () {
  it("should submit an application for the Test: Coliseum listing", function () {
    cy.beginApplication("Test: Coliseum")
    cy.step1()
    cy.step2()
    cy.step3()
    cy.step4()
    cy.step5()
    cy.step6Members()
    cy.step7()
    cy.step8()
    cy.step9()
    cy.step10()
    cy.step11()
    cy.step12()
    cy.step13SelectPreferences()
    cy.step15()
    cy.step16()
    // Check values on summary
    // Go back and edit sections
    cy.step17()
  })
})
