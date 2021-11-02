declare namespace Cypress {
  type Application = import("@bloom-housing/backend-core/types").Application

  interface Chainable {
    beginApplication(listingName: string): Chainable
    checkErrorAlert(command: string): Chainable
    checkErrorMessages(command: string): Chainable
    getByTestId(testId: string): Chainable<Element>
    getPhoneFieldByTestId(testId: string): Chainable<Element>
    goNext(): Chainable<Element>
    isNextRouteValid(currentStep: string, skip?: number): Chainable
    signIn(): Chainable
    step1PrimaryApplicantName(application: Application): Chainable
    step2PrimaryApplicantAddresses(application: Application): Chainable
    step3AlternateContactType(application: Application): Chainable
    step4AlternateContactName(application: Application): Chainable
    step5AlternateContactInfo(application: Application): Chainable
    step6HouseholdSize(application: Application): Chainable
    step7AddHouseholdMembers(application: Application): Chainable
    step8AddHouseholdMember(application: Application): Chainable
    step9PreferredUnits(application: Application): Chainable
    step10Accessibility(application: Application): Chainable
    step11IncomeVouchers(application: Application): Chainable
    step12Income(application: Application): Chainable
    step13SelectPreferences(application: Application): Chainable
    step14GeneralPool(): Chainable
    step15Demographics(application: Application): Chainable
    step16Summary(application: Application): Chainable
    step17TermsAndSubmit(application: Application): Chainable
  }
}
