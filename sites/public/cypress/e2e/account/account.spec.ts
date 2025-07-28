import { publicUser, updatedPublicUser } from "../../mockData/userData"

describe("User accounts", () => {
  it("should allow users to update their account information", () => {
    cy.visit("/sign-in")
    cy.signIn(publicUser.email, publicUser.password)

    // Assert that a user's data shows up on their settings page
    cy.getByID("account-dashboard-settings").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("account-first-name").should("have.value", publicUser.firstName)
    cy.getByTestId("account-middle-name").should("have.value", publicUser.middleName)
    cy.getByTestId("account-last-name").should("have.value", publicUser.lastName)
    cy.getByTestId("dob-field-month").should("have.value", publicUser.birthMonth)
    cy.getByTestId("dob-field-day").should("have.value", publicUser.birthDay)
    cy.getByTestId("dob-field-year").should("have.value", publicUser.birthYear)
    cy.getByTestId("account-email").should("have.value", publicUser.email)

    // Change the name fields
    cy.getByTestId("account-first-name").clear().type(updatedPublicUser.firstName)
    cy.getByTestId("account-middle-name").clear().type(updatedPublicUser.middleName)
    cy.getByTestId("account-last-name").clear().type(updatedPublicUser.lastName)
    cy.getByID("account-submit-name").click()
    cy.getByTestId("alert-box").contains("Name update successful")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    // Change the birthday field
    cy.getByTestId("dob-field-month").clear().type(updatedPublicUser.birthMonth)
    cy.getByTestId("dob-field-day").clear().type(updatedPublicUser.birthDay)
    cy.getByTestId("dob-field-year").clear().type(updatedPublicUser.birthYear)
    cy.getByID("account-submit-dob").click()
    cy.getByTestId("alert-box").contains("Birthdate update successful")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    // Change the password
    cy.getByTestId("account-current-password").type(publicUser.password)
    cy.getByTestId("account-password").type(updatedPublicUser.password)
    cy.getByTestId("account-password-confirmation").type(updatedPublicUser.passwordConfirmation)
    cy.getByID("account-submit-password").click()
    cy.getByTestId("alert-box").contains("Password update successful")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    cy.visit("/account/edit")

    // Confirm that the data actually updated
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("account-first-name").should("have.value", updatedPublicUser.firstName)
    cy.getByTestId("account-middle-name").should("have.value", updatedPublicUser.middleName)
    cy.getByTestId("account-last-name").should("have.value", updatedPublicUser.lastName)
    cy.getByTestId("dob-field-month").should("have.value", updatedPublicUser.birthMonth)
    cy.getByTestId("dob-field-day").should("have.value", updatedPublicUser.birthDay)
    cy.getByTestId("dob-field-year").should("have.value", updatedPublicUser.birthYear)

    cy.signOut()

    // Confirm that the new password works
    cy.visit("/sign-in")
    cy.signIn(updatedPublicUser.email, updatedPublicUser.password)
  })
})
