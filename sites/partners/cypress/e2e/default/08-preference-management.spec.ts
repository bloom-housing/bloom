describe("Preference Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  beforeEach(() => {
    cy.visit("/")
    cy.getByTestId("Settings-2").click()
    cy.location("pathname").should("include", "/settings")
  })

  it("should be able to create a new preference", () => {
    //Create
    cy.getByID("preference-add-item").should("be.enabled")
    cy.getByID("preference-add-item").click()
    cy.getByTestId("preference-title").type("Preference Title")
    cy.getByTestId("preference-description").type("Preference Description", {
      force: true, // we're not sure why, but without this Cypress claims the textarea is covered and can't be used
    })
    cy.getByTestId("preference-link").type("https://www.example.com")
    cy.getByTestId("preference-link-title").type("Preference Link Title")

    cy.getByTestId("preference-jurisdiction").select("Bay Area")
    cy.getByID("preference-add-option-button").click()
    cy.getByTestId("preference-option-title").type("Preference Option Title")
    cy.getByTestId("preference-option-description").type("Preference Option Description", {
      force: true, // we're not sure why, but without this Cypress claims the textarea is covered and can't be used
    })
    cy.getByTestId("preference-option-link").type("https://www.example2.com")
    cy.getByTestId("preference-option-link-title").type("Preference Option Link Title")
    cy.getByTestId("collect-address-yes").click({ force: true })
    cy.getByTestId("exclusive-question-exclusive").check()
    cy.getByID("preference-option-save").click()

    cy.getByTestId("validation-method-map").click({ force: true })
    cy.getByTestId("preference-map-layer").select("Redlined Districts")
    cy.getByTestId("collect-name-yes").click({ force: true })
    cy.getByTestId("collect-relationship-yes").click({ force: true })
    cy.getByID("preference-option-save").click()

    cy.getByTestId("preference-opt-out-label").clear()
    cy.getByTestId("preference-opt-out-label").type("Preference Opt Out Label")
    cy.getByTestId("preference-jurisdiction").select("Bay Area")
    cy.getByID("preference-save-button").click()
    cy.getByTestId("toast-alert")
      .contains("Preference Created")
      .should("have.text", "Preference Created")

    // Verify
    cy.getByTestId("preference-edit-icon: Preference Title").should("be.enabled")
    cy.getByTestId("preference-edit-icon: Preference Title").click()

    cy.getByTestId("preference-title").should("have.value", "Preference Title")
    cy.getByTestId("preference-description").should("have.value", "Preference Description")
    cy.getByTestId("preference-link").should("have.value", "https://www.example.com")
    cy.getByTestId("preference-link-title").should("have.value", "Preference Link Title")

    cy.getByTestId("option-edit-icon: Preference Option Title").click()
    cy.getByTestId("preference-option-title").should("have.value", "Preference Option Title")
    cy.getByTestId("preference-option-description").should(
      "have.value",
      "Preference Option Description"
    )
    cy.getByTestId("preference-option-link").should("have.value", "https://www.example2.com")
    cy.getByTestId("preference-option-link-title").should(
      "have.value",
      "Preference Option Link Title"
    )

    cy.getByTestId("collect-address-yes").should("be.checked")
    cy.getByTestId("validation-method-map").should("be.checked")
    cy.getByTestId("preference-map-layer")
      .find("option:selected")
      .invoke("text")
      .should("equal", "Redlined Districts")
    cy.getByTestId("collect-name-yes").should("be.checked")
    cy.getByTestId("collect-relationship-yes").should("be.checked")
    cy.getByTestId("exclusive-question-exclusive").should("have.value", "exclusive")
    cy.getByID("preference-option-save").click()

    cy.getByTestId("preference-opt-out-label").should("have.value", "Preference Opt Out Label")
    cy.getByTestId("show-on-listing-question-yes").should("have.value", "yes")
    cy.getByTestId("preference-jurisdiction").contains("Bay Area")
    cy.getByID("preference-save-button").click()
  })
})
