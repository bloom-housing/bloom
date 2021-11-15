declare namespace Cypress {
  type Application = import("@bloom-housing/backend-core/types").Application

  interface Chainable {
    beginApplication(listingName: string): Chainable
    beginApplicationRejectAutofill(listingName: string): Chainable
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
    step8PreferredUnits(application: Application): Chainable
    step9Accessibility(application: Application): Chainable
    step10Changes(application: Application): Chainable
    step11Student(application: Application): Chainable
    step12IncomeVouchers(application: Application): Chainable
    step13Income(application: Application): Chainable
    step14SelectPreferences(application: Application): Chainable
    step15GeneralPool(): Chainable
    step16Demographics(application: Application): Chainable
    step17Summary(application: Application): Chainable
    step18TermsAndSubmit(application: Application): Chainable
    submitApplication(listingName: string, application: Application, autofill?: boolean)
  }
}
