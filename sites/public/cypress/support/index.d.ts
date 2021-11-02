declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    beginApplication(listingName: string): Chainable
    step1(): Chainable
    step2(): Chainable
    step3(): Chainable
    step4(): Chainable
    step5(): Chainable
    step6Members(): Chainable
    step6Alone(): Chainable
    step7(): Chainable
    step8(): Chainable
    step9(): Chainable
    step10(): Chainable
    step11(): Chainable
    step12(): Chainable
    step13SelectPreferences(): Chainable
    step13NoPreferences(): Chainable
    step14(): Chainable
    step15(): Chainable
    step16(): Chainable
    step17(): Chainable
    signIn(): Chainable
    goNext(): Chainable<Element>
    goToReview(): Chainable<Element>
    getByTestId(testId: string): Chainable<Element>
    getPhoneFieldByTestId(testId: string): Chainable<Element>
    getSessionStorageApplication(): Chainable
    getListing(): Record<string, any>
    loadConfig(
      initialValues?: Record<string, any>,
      configFile?: string,
      configOverrides?: Record<string, any>
    ): Chainable
    isNextRouteValid(currentStep: string, skip?: number): Chainable
    checkErrorAlert(command: string): Chainable
    checkErrorMessages(command: string): Chainable
  }
}
