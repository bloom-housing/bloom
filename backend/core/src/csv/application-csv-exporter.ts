import { Injectable, Scope } from "@nestjs/common"
import { CsvBuilder } from "./csv-builder.service"
import { Application } from "../applications/entities/application.entity"
import { capitalizeFirstLetter } from "../libs/stringLib"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationCsvExporter {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  private mapAddressFields(oldKey: string, newKey: string, sort) {
    const obj = {}
    const fields = [
      "street",
      "street2",
      "city",
      "zipCode",
      "county",
      "state",
      "placeName",
      "latitude",
      "longitude",
    ]
    fields.forEach((field, i) => {
      obj[`${oldKey} ${field}`] = `_${sort}${i}_${newKey} ${capitalizeFirstLetter(field)}`
    })

    return obj
  }

  private mapPrimaryApplicantFields(sort: string) {
    const obj = {}
    const fields = [
      "firstName",
      "middleName",
      "lastName",
      "birthMonth",
      "birthDay",
      "birthYear",
      "emailAddress",
      "phoneNumber",
      "phoneNumberType",
    ]
    fields.forEach((field, i) => {
      obj[`applicant ${field}`] = `_${sort}${i}_Primary Applicant ${this.csvBuilder.capAndSplit(
        field
      )}`
    })

    return obj
  }

  private mapAlternateContactFields(sort: string) {
    const obj = {}
    const fields = [
      "firstName",
      "middleName",
      "lastName",
      "type",
      "agency",
      "otherType",
      "emailAddress",
      "phoneNumber",
    ]

    fields.forEach((field, i) => {
      obj[
        `alternateContact ${field}`
      ] = `_${sort}${i}_Alternate Contact ${this.csvBuilder.capAndSplit(field)}`
    })

    return obj
  }

  export(applications: Omit<Application, "listing">[], includeDemographics?: boolean): string {
    const excludeKeys = [
      " id",
      "appUrl",
      "createdAt",
      "confirmationCode",
      "deletedAt",
      "listingId",
      "noEmail",
      "noPhone",
      " orderId",
      "updatedAt",
      "userId",
      "numBedrooms",
    ]
    if (!includeDemographics) {
      excludeKeys.push("demographics")
    }
    this.csvBuilder.setExcludedKeys(excludeKeys)
    this.csvBuilder.setMappedFields({
      id: "_A_Application Number",
      submissionType: "_B_Application Type",
      submissionDate: "_C_Application Submission Date",
      ...this.mapPrimaryApplicantFields("D"),
      additionalPhoneNumber: "_E_Primary Applicant Additional Phone Number",
      contactPreferences: "_F_Primary Applicant Preferred Contact Type",
      ...this.mapAddressFields("applicant address", "Primary Applicant Address", "G"),
      ...this.mapAddressFields("mailingAddress", "Primary Applicant Mailing Address", "H"),
      ...this.mapAddressFields("applicant workAddress", "Primary Applicant Work Address", "I"),
      ...this.mapAlternateContactFields("J"),
      ...this.mapAddressFields(
        "alternateContact mailingAddress",
        "Alternate Contact Mailing Address",
        "K"
      ),
      income: "_I_Income",
      accessibility: "_L_ADA",
      incomeVouchers: "_M_Vouchers or Subsidies",
      preferredUnit: "_N_Requested Unit Type",
      preferences: "_O_Preferences",
      householdSize: "_P_Household Size",
      householdMembers: "_Q_Household Members",
      markedAsDuplicate: "_R_Marked As Duplicate",
      flagged: "_S_Flagged As Duplicate",
      demographics: "_T_Demographics",
    })
    return this.csvBuilder.build(applications)
  }
}
