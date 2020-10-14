declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByID(value: string): Chainable<Element>
    goNext(): Chainable<Element>
    getSubmissionContext(): Chainable
    loadConfig(initialValues?: Record<string, any>): Chainable
    isNextRouteValid(currentStep: string): Chainable
    checkErrorAlert(command: string): Chainable
    checkErrorMessages(command: string): Chainable
  }
}
