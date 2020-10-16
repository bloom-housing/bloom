describe("applications/contact/address", function () {
  const route = "/applications/contact/address"
  beforeEach(() => {
    cy.loadConfig()
    cy.fixture("applications/address.json").as("data")
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    // try to trigger form
    cy.goNext()

    cy.checkErrorAlert("be.visible")

    // check errors
    cy.getByID("applicant.phoneNumber-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.phoneNumberType-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressStreet-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressCity-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressState-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressZipCode-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("contactPreferences-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.workInRegion-error").should("be.visible").and("not.to.be.empty")
  })

  it("Phone number & type fields should be disabled when user check option", function () {
    cy.getByID("noPhone").check()

    cy.getByID("applicant.phoneNumber").should("be.disabled")
    cy.getByID("applicant.phoneNumberType").should("be.disabled")
    cy.getByID("additionalPhone").should("be.disabled")
  })

  it("should save form values and redirect to the next step", function () {
    cy.getByID("applicant.phoneNumber").type(this.data["applicant.phoneNumber"])
    cy.getByID("applicant.phoneNumberType").select(this.data["applicant.phoneNumberType"])

    cy.getByID("additionalPhone").check()

    cy.getByID("additionalPhoneNumber").type(this.data["additionalPhoneNumber"])
    cy.getByID("additionalPhoneNumberType").select(this.data["additionalPhoneNumberType"])

    cy.getByID("addressStreet").type(this.data["addressStreet"])
    cy.getByID("addressStreet2").type(this.data["addressStreet2"])
    cy.getByID("addressCity").type(this.data["addressCity"])
    cy.getByID("addressState").select(this.data["addressState"])
    cy.getByID("addressZipCode").type(this.data["addressZipCode"])

    // mailing address section
    cy.getByID("sendMailToMailingAddress").check()

    cy.getByID("mailingAddressStreet").type(this.data["mailingAddressStreet"])
    cy.getByID("mailingAddressStreet2").type(this.data["mailingAddressStreet2"])
    cy.getByID("mailingAddressCity").type(this.data["mailingAddressCity"])
    cy.getByID("mailingAddressState").select(this.data["mailingAddressState"])
    cy.getByID("mailingAddressZipCode").type(this.data["mailingAddressZipCode"])

    // contact prefference
    cy.getByID("email").check()

    // work address section
    cy.getByID("workInRegionYes").check()

    cy.getByID("workAddressStreet").type(this.data["workAddressStreet"])
    cy.getByID("workAddressStreet2").type(this.data["workAddressStreet2"])
    cy.getByID("workAddressCity").type(this.data["workAddressCity"])
    cy.getByID("workAddressState").select(this.data["workAddressState"])
    cy.getByID("workAddressZipCode").type(this.data["workAddressZipCode"])

    cy.goNext()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    // check next route
    cy.isNextRouteValid("primaryApplicantAddress")

    // check context values
    cy.getSubmissionContext().should("deep.nested.include", {
      additionalPhone: true,
      additionalPhoneNumber: this.data["additionalPhoneNumberFormatted"],
      additionalPhoneNumberType: this.data["additionalPhoneNumberType"],
      sendMailToMailingAddress: true,
      mailingAddress: {
        street: this.data["mailingAddressStreet"],
        street2: this.data["mailingAddressStreet2"],
        city: this.data["mailingAddressCity"],
        state: this.data["mailingAddressState"],
        zipCode: this.data["mailingAddressZipCode"],
      },
      contactPreferences: [this.data["contactPreferences"]],
    })

    cy.getSubmissionContext()
      .its("applicant")
      .should("deep.nested.include", {
        phoneNumber: this.data["applicant.phoneNumberFormatted"],
        phoneNumberType: this.data["applicant.phoneNumberType"],
        address: {
          street: this.data["addressStreet"],
          street2: this.data["addressStreet2"],
          city: this.data["addressCity"],
          state: this.data["addressState"],
          zipCode: this.data["addressZipCode"],
          county: "",
          latitude: null,
          longitude: null,
        },
        workAddress: {
          street: this.data["workAddressStreet"],
          street2: this.data["workAddressStreet2"],
          city: this.data["workAddressCity"],
          state: this.data["workAddressState"],
          zipCode: this.data["workAddressZipCode"],
          county: "",
          latitude: null,
          longitude: null,
        },
        workInRegion: this.data["workInRegion"],
      })
  })
})
