declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByID(value: string): Chainable<Element>
    goNext(): Chainable<Element>
    goToReview(): Chainable<Element>
    getSubmissionContext(): Chainable
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
