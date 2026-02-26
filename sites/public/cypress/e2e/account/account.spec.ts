import {
  advocateUser,
  publicUser,
  updatedAdvocateUser,
  updatedPublicUser,
} from "../../mockData/userData"

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
    cy.signOut()
  })

  it("should allow advocates to update their account information", () => {
    cy.visit("/sign-in")
    cy.signIn(advocateUser.email, advocateUser.password)

    // Assert that seeded advocate data shows up on their settings page
    cy.getByID("account-dashboard-settings").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("account-first-name").should("have.value", advocateUser.firstName)
    cy.getByTestId("account-middle-name").should("have.value", advocateUser.middleName)
    cy.getByTestId("account-last-name").should("have.value", advocateUser.lastName)
    cy.getByTestId("account-address-street").should("have.value", advocateUser.street)
    cy.getByTestId("account-address-city").should("have.value", advocateUser.city)
    cy.getByTestId("account-address-state").should("have.value", advocateUser.state)
    cy.getByTestId("account-address-zip").should("have.value", advocateUser.zipCode)

    // Change agency (pick a non-empty option different from current value)
    cy.getByTestId("account-agency")
      .find("option")
      .then(($options) => {
        const options = Array.from($options)
          .map((option) => option.value)
          .filter((value) => value)

        cy.getByTestId("account-agency")
          .invoke("val")
          .then((currentValue) => {
            const nextValue = options.find((value) => value !== currentValue)
            cy.wrap((nextValue || currentValue) as string).as("selectedAgencyId")
            if (nextValue) {
              cy.getByTestId("account-agency").select(nextValue)
              cy.getByID("account-submit-agency").click()
              cy.getByTestId("alert-box").contains("User updated")
              cy.get("[aria-label='close alert']").click()
              cy.getByTestId("alert-box").should("not.exist")
            }
          })
      })

    // Change the name fields
    cy.getByTestId("account-first-name").clear().type(updatedAdvocateUser.firstName)
    cy.getByTestId("account-middle-name").clear().type(updatedAdvocateUser.middleName)
    cy.getByTestId("account-last-name").clear().type(updatedAdvocateUser.lastName)
    cy.getByID("account-submit-name").click()
    cy.getByTestId("alert-box").contains("Name update successful")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    // Change the address fields
    cy.getByTestId("account-address-street").clear().type(updatedAdvocateUser.street)
    cy.getByTestId("account-address-street2").clear().type(updatedAdvocateUser.street2)
    cy.getByTestId("account-address-city").clear().type(updatedAdvocateUser.city)
    cy.getByTestId("account-address-state").select(updatedAdvocateUser.state)
    cy.getByTestId("account-address-zip").clear().type(updatedAdvocateUser.zipCode)
    cy.getByID("account-submit-address").click()
    cy.getByTestId("alert-box").contains("User updated")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    // Change phone fields (including additional phone)
    cy.getByTestId("account-phone-number").children().clear().type(updatedAdvocateUser.phoneNumber)
    cy.getByTestId("account-phone-extension").clear().type(updatedAdvocateUser.phoneExtension)
    cy.getByTestId("account-phone-type").select(updatedAdvocateUser.phoneType)
    cy.getByTestId("account-additional-phone-toggle").check({ force: true })
    cy.getByTestId("account-additional-phone-number")
      .children()
      .clear()
      .type(updatedAdvocateUser.additionalPhoneNumber)
    cy.getByTestId("account-additional-phone-extension")
      .clear()
      .type(updatedAdvocateUser.additionalPhoneExtension)
    cy.getByTestId("account-additional-phone-type").select(updatedAdvocateUser.additionalPhoneType)
    cy.getByID("account-submit-phone").click()
    cy.getByTestId("alert-box").contains("User updated")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    // Change the password
    cy.getByTestId("account-current-password").type(advocateUser.password)
    cy.getByTestId("account-password").type(updatedAdvocateUser.password)
    cy.getByTestId("account-password-confirmation").type(updatedAdvocateUser.passwordConfirmation)
    cy.getByID("account-submit-password").click()
    cy.getByTestId("alert-box").contains("Password update successful")
    cy.get("[aria-label='close alert']").click()
    cy.getByTestId("alert-box").should("not.exist")

    cy.visit("/account/edit")

    // Confirm the updated name and address persisted
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("account-first-name").should("have.value", updatedAdvocateUser.firstName)
    cy.getByTestId("account-middle-name").should("have.value", updatedAdvocateUser.middleName)
    cy.getByTestId("account-last-name").should("have.value", updatedAdvocateUser.lastName)
    cy.getByTestId("account-address-street").should("have.value", updatedAdvocateUser.street)
    cy.getByTestId("account-address-street2").should("have.value", updatedAdvocateUser.street2)
    cy.getByTestId("account-address-city").should("have.value", updatedAdvocateUser.city)
    cy.getByTestId("account-address-state").should("have.value", updatedAdvocateUser.state)
    cy.getByTestId("account-address-zip").should("have.value", updatedAdvocateUser.zipCode)
    cy.getByTestId("account-phone-number").children().should("contain.value", "3434")
    cy.getByTestId("account-phone-extension").should(
      "have.value",
      updatedAdvocateUser.phoneExtension
    )
    cy.getByTestId("account-phone-type").should("have.value", updatedAdvocateUser.phoneType)
    cy.getByTestId("account-additional-phone-number").children().should("contain.value", "7878")
    cy.getByTestId("account-additional-phone-extension").should(
      "have.value",
      updatedAdvocateUser.additionalPhoneExtension
    )
    cy.getByTestId("account-additional-phone-type").should(
      "have.value",
      updatedAdvocateUser.additionalPhoneType
    )

    cy.get("@selectedAgencyId").then((agencyId) => {
      cy.getByTestId("account-agency").should("have.value", agencyId)
    })

    cy.signOut()

    // Confirm that the new password works
    cy.visit("/sign-in")
    cy.signIn(updatedAdvocateUser.email, updatedAdvocateUser.password)
    cy.signOut()
  })
})
