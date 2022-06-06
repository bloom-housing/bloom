/* eslint-disable @typescript-eslint/no-unused-vars */
type attachFileSubjectArgs = {
  subjectType: string
}

interface fillFromFieldOption {
  byTestID?: boolean
  fieldID: string
  fixtureID?: string
  hardcodedValue?: string
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
    verifyAlertBox(): Chainable
    signOut(): Chainable
    fillFormFields(
      fixture: string,
      fieldsToType: fillFromFieldOption[],
      fieldsToSelect: fillFromFieldOption[]
    ): Chainable
    verifyFormFields(fixture: string, verifyFormFields: fillFromFieldOption[]): Chainable
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
