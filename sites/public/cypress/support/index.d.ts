declare namespace Cypress {
  type Application = import("@bloom-housing/shared-helpers/src/types/backend-swagger").Application

  interface Chainable {
    beginApplicationRejectAutofill(listingName: string): Chainable
    beginApplicationSignedIn(listingName: string, autofill?: boolean): Chainable
    checkErrorAlert(command: string): Chainable
    checkErrorMessages(command: string): Chainable
    getByTestId(testId: string): Chainable<Element>
    getByID(id: string): Chainable<Element>
    getPhoneFieldByTestId(testId: string): Chainable<Element>
    goNext(): Chainable<Element>
    isNextRouteValid(currentStep: string, skip?: number): Chainable
    signIn(email?: string, password?: string): Chainable
    signOut(): Chainable
    step1PrimaryApplicantName(application: Application, autofill?: boolean): Chainable
    step2PrimaryApplicantAddresses(application: Application, autofill?: boolean): Chainable
    step3AlternateContactType(application: Application, autofill?: boolean): Chainable
    step4AlternateContactName(application: Application, autofill?: boolean): Chainable
    step5AlternateContactInfo(application: Application, autofill?: boolean): Chainable
    step6HouseholdSize(application: Application): Chainable
    step7AddHouseholdMembers(application: Application, autofill?: boolean): Chainable
    step8PreferredUnits(application: Application, autofill?: boolean): Chainable
    step9Accessibility(application: Application, autofill?: boolean): Chainable
    step10Programs(application: Application, autofill?: boolean): Chainable
    step10Changes(application: Application, autofill?: boolean): Chainable
    step11Student(application: Application, programsExist: boolean, autofill?: boolean): Chainable
    step12Student(application: Application, autofill?: boolean): Chainable
    step12Programs(application: Application): Chainable
    step13IncomeVouchers(application: Application, autofill?: boolean): Chainable
    step14Income(application: Application, autofill?: boolean): Chainable
    step15SelectPreferences(application: Application): Chainable
    step16GeneralPool(): Chainable
    step17Demographics(application: Application, autofill?: boolean): Chainable
    step18Summary(application: Application, verify?: boolean): Chainable
    step19TermsAndSubmit(application: Application): Chainable
    submitApplication(
      listingName: string,
      application: Application,
      signedIn: boolean,
      verify?: boolean,
      autofill?: boolean
    )
  }
}
