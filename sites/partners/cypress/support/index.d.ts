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
    login(): Chainable
    attachFile(command: string, optionalProcessingConfig: attachFileSubjectArgs): Chainable
    verifyAlertBox(): Chainable
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
