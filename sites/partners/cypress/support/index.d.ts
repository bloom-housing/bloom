/* eslint-disable @typescript-eslint/no-unused-vars */
type attachFileSubjectArgs = {
  subjectType: string
}

type fieldObj = { id: string; fieldKey: string }

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByID(value: string): Chainable<Element>
    getByTestId(value: string): Chainable<Element>
    loginAndAcceptTerms(fixture?: string): Chainable
    login(fixture?: string): Chainable
    loginWithMfa(): Chainable
    attachFile(command: string, optionalProcessingConfig: attachFileSubjectArgs): Chainable
    verifyAlertBox(): Chainable
    fillPrimaryApplicant(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillAlternateContact(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillHouseholdMember(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillHouseholdDetails(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillHouseholdIncome(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillDemographics(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillTerms(value: Record<string, string>, submit: boolean): Chainable
    verifyApplicationData(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyPrimaryApplicant(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyAlternateContact(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyHouseholdMembers(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyHouseholdDetails(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyHouseholdIncome(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    verifyTerms(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    fillMailingAddress(value: Record<string, string>, fieldsToSkip?: string[]): Chainable
    signOut(): Chainable
    fillFields(
      obj: Record<string, string>,
      fieldsToType: fieldObj[],
      fieldsToSelect: fieldObj[],
      fieldsToClick: fieldObj[],
      fieldsToSkip: string[]
    ): Chainable
    addMinimalListing(
      listingName: string,
      isLottery: boolean,
      isApproval: boolean,
      jurisdiction: boolean
    ): Chainable
    addMinimalApplication(listingName: string): Chainable
    findAndOpenListing(listingName: string): Chainable
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
