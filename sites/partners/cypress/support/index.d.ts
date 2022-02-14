/* eslint-disable @typescript-eslint/no-unused-vars */
type attachFileSubjectArgs = {
  subjectType: string
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByID(value: string): Chainable<Element>
    getByTestId(value: string): Chainable<Element>
    login(): Chainable
    loginWithMfa(): Chainable
    attachFile(command: string, optionalProcessingConfig: attachFileSubjectArgs): Chainable
    verifyAlertBox(): Chainable
    signOut(): Chainable
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
