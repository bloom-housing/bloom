describe("Form contact/address", function () {
  beforeEach(() => {
    cy.fixture("application/address.json").as("valuesJSON")
    cy.visit("/applications/contact/address")
  })

  it("Renders the /contact/address form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", "/applications/contact/address")
  })

  it("Should display initial form errors", function () {
    // try to trigger form
    cy.goNext()

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

  it("Should show required additional phone fields when user check option", function () {
    cy.getByID("additionalPhone").check()

    cy.getByID("additionalPhoneNumber").should("be.visible")
    cy.getByID("additionalPhoneNumberType").should("be.visible")

    cy.goNext()

    // should notify errors
    cy.getByID("additionalPhoneNumber-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("additionalPhoneNumberType-error").should("be.visible").and("not.to.be.empty")
  })

  // it("Should show required mailing address fields when user check 'different mailing address' option", function () {
  //   cy.getByID("sendMailToMailingAddress").check()

  //   cy.getByID("mailingAddressStreet").should("be.visible")
  //   cy.getByID("mailingAddressStreet2").should("be.visible")
  //   cy.getByID("mailingAddressCity").should("be.visible")
  //   cy.getByID("mailingAddressState").should("be.visible")
  //   cy.getByID("mailingAddressZipCode").should("be.visible")

  //   cy.goNext()

  //   cy.getByID("mailingAddressStreet-error").should("be.visible").and("not.to.be.empty")
  //   cy.getByID("mailingAddressCity-error").should("be.visible").and("not.to.be.empty")
  //   cy.getByID("mailingAddressState-error").should("be.visible").and("not.to.be.empty")
  //   cy.getByID("mailingAddressZipCode-error").should("be.visible").and("not.to.be.empty")
  // })

  it("should save form values and redirect to the next step", function () {
    cy.getByID("applicant.phoneNumber").type(this.valuesJSON["applicant.phoneNumber"])
    cy.getByID("applicant.phoneNumberType").select(this.valuesJSON["applicant.phoneNumberType"])

    cy.getByID("additionalPhone").check()

    cy.getByID("additionalPhoneNumber").type(this.valuesJSON["additionalPhoneNumber"])
    cy.getByID("additionalPhoneNumberType").select(this.valuesJSON["additionalPhoneNumberType"])

    cy.getByID("addressStreet").type(this.valuesJSON["addressStreet"])
    cy.getByID("addressStreet2").type(this.valuesJSON["addressStreet2"])
    cy.getByID("addressCity").type(this.valuesJSON["addressCity"])
    cy.getByID("addressState").select(this.valuesJSON["addressState"])
    cy.getByID("addressZipCode").type(this.valuesJSON["addressZipCode"])

    // mailing address section
    cy.getByID("sendMailToMailingAddress").check()

    cy.getByID("mailingAddressStreet").type(this.valuesJSON["mailingAddressStreet"])
    cy.getByID("mailingAddressStreet2").type(this.valuesJSON["mailingAddressStreet2"])
    cy.getByID("mailingAddressCity").type(this.valuesJSON["mailingAddressCity"])
    cy.getByID("mailingAddressState").select(this.valuesJSON["mailingAddressState"])
    cy.getByID("mailingAddressZipCode").type(this.valuesJSON["mailingAddressZipCode"])

    // contact prefference
    cy.getByID("email").check()

    // work address section
    cy.getByID("workInRegionYes").check()

    cy.getByID("workAddressStreet").type(this.valuesJSON["workAddressStreet"])
    cy.getByID("workAddressStreet2").type(this.valuesJSON["workAddressStreet2"])
    cy.getByID("workAddressCity").type(this.valuesJSON["workAddressCity"])
    cy.getByID("workAddressState").select(this.valuesJSON["workAddressState"])
    cy.getByID("workAddressZipCode").type(this.valuesJSON["workAddressZipCode"])

    cy.goNext()

    // no errors should be visible
    cy.get(".error-message").should("not.exist")

    // check context values
    // WIP

    // cy.getSubmissionContext().should("deep.include", {
    //   phoneNumber: this.valuesJSON["applicant.phoneNumber"],
    //   phoneNumberType: this.valuesJSON["applicant.phoneNumberType"],
    //   additionalPhone: true,
    //   additionalPhoneNumber: this.valuesJSON["additionalPhoneNumber"],
    //   additionalPhoneNumberType: this.valuesJSON["additionalPhoneNumberType"],
    //   address: {
    //     street: this.valuesJSON["addressStreet"],
    //     street2: this.valuesJSON["addressStreet2"],
    //     city: this.valuesJSON["addressCity"],
    //     state: this.valuesJSON["addressState"],
    //     zipCode: this.valuesJSON["addressZipCode"],
    //     county: "",
    //   },
    //   sendMailToMailingAddress: true,
    //   mailingAddress: {
    //     street: this.valuesJSON["mailingAddressStreet"],
    //     street2: this.valuesJSON["mailingAddressStreet2"],
    //     city: this.valuesJSON["mailingAddressCity"],
    //     state: this.valuesJSON["mailingAddressState"],
    //     zipCode: this.valuesJSON["mailingAddressZipCode"],
    //   },
    //   contactPreferences: [this.valuesJSON["contactPreferences"]],
    //   workInRegion: true,
    //   workAddress: {
    //     street: this.valuesJSON["workAddressStreet"],
    //     street2: this.valuesJSON["workAddressStreet2"],
    //     city: this.valuesJSON["workAddressCity"],
    //     state: this.valuesJSON["workAddressState"],
    //     zipCode: this.valuesJSON["workAddressZipCode"],
    //     county: "",
    //     latitude: null,
    //     longitude: null,
    //   },
    // })

    // TODO: check next step (when steps config will be ready)
  })
})
