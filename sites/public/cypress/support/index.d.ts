declare namespace Cypress {
  type Application = import("@bloom-housing/backend-core/types").Application

  interface Chainable {
    beginApplicationRejectAutofill(listingName: string): Chainable
    beginApplicationSignedIn(listingName: string): Chainable
    checkErrorAlert(command: string): Chainable
    checkErrorMessages(command: string): Chainable
    getByTestId(testId: string): Chainable<Element>
    getPhoneFieldByTestId(testId: string): Chainable<Element>
    goNext(): Chainable<Element>
    isNextRouteValid(currentStep: string, skip?: number): Chainable
    signIn(): Chainable
    signOut(): Chainable
    step1PrimaryApplicantName(application: Application): Chainable
    step2PrimaryApplicantAddresses(application: Application): Chainable
    step3AlternateContactType(application: Application): Chainable
    step4AlternateContactName(application: Application): Chainable
    step5AlternateContactInfo(application: Application): Chainable
    step6HouseholdSize(application: Application): Chainable
    step7AddHouseholdMembers(application: Application): Chainable
    step8PreferredUnits(application: Application): Chainable
    step9Accessibility(application: Application): Chainable
    step10Programs(application: Application): Chainable
    step11Changes(application: Application): Chainable
    step12Student(application: Application): Chainable
    step13IncomeVouchers(application: Application): Chainable
    step14Income(application: Application): Chainable
    step15SelectPreferences(application: Application): Chainable
    step16GeneralPool(): Chainable
    step17Demographics(application: Application): Chainable
    step18Summary(application: Application): Chainable
    step19TermsAndSubmit(application: Application): Chainable
    submitApplication(listingName: string, application: Application, signedIn: boolean)
  }
}
