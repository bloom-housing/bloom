import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder, KeyNumber } from "./csv-builder.service"
import { capitalizeFirstLetter } from "../libs/stringLib"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationCsvExporter {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  mapHouseholdMembers(app) {
    const obj = {
      "First Name": app.householdMembers_first_name,
      "Middle Name": app.householdMembers_middle_name,
      "Last Name": app.householdMembers_last_name,
      Birthday: this.getBirthday(
        app.householdMembers_birth_day,
        app.householdMembers_birth_month,
        app.householdMembers_birth_year
      ),
      "Email Address": app.householdMembers_email_address,
      "Phone Number": app.householdMembers_phone_number,
      "Phone Number Type": app.householdMembers_phone_number_type,
      "Same Address as Primary Applicant": this.csvBuilder.formatBoolean(
        app.householdMembers_same_address
      ),
      Relationship: app.householdMembers_relationship,
      "Work in Region": this.csvBuilder.formatBoolean(app.householdMembers_work_in_region),
      City: app.householdMembers_address_city,
      State: app.householdMembers_address_state,
      Street: app.householdMembers_address_street,
      "Street 2": app.householdMembers_address_street2,
      "Zip Code": app.householdMembers_address_zip_code,
    }
    return obj
  }

  getBirthday(day, month, year) {
    let birthday = ""
    if (day && month && year) {
      birthday = `${month}/${day}/${year}`
    }
    return birthday
  }

  // could use translations
  unitTypeToReadable(type) {
    const typeMap = {
      sro: "Single Room Occupancy",
      studio: "Studio",
      oneBdrm: "One Bedroom",
      twoBdrm: "Two Bedroom",
      threeBdrm: "Three Bedroom",
      fourBdrm: "Four+ Bedroom",
    }
    return typeMap[type] ?? type
  }

  exportFromObject(applications: { [key: string]: any }, includeDemographics?: boolean): string {
    const extraHeaders: KeyNumber = {
      "Household Members": 1,
      Preference: 1,
    }
    const preferenceKeys: KeyNumber = {}
    const applicationsObj = applications.reduce((obj, app) => {
      let demographics = {}

      if (obj[app.application_id] === undefined) {
        if (includeDemographics) {
          demographics = {
            Ethnicity: app.demographics_ethnicity,
            Gender: app.demographics_gender,
            Race: app.demographics_race,
            "Sexual Orientation": app.demographics_sexual_orientation,
            "How Did You Hear": app.demographics_how_did_you_hear.join(", "),
          }
        }

        obj[app.application_id] = {
          "Application Number": app.application_id,
          "Application Type":
            app.application_submission_type === "electronical"
              ? "electronic"
              : app.application_submission_type,
          "Application Submission Date": dayjs(app.application_submission_date).format(
            "MM-DD-YYYY h:mm:ssA"
          ),
          "Primary Applicant First Name": app.applicant_first_name,
          "Primary Applicant Middle Name": app.applicant_middle_name,
          "Primary Applicant Last Name": app.applicant_last_name,
          "Primary Applicant Birthday": this.getBirthday(
            app.applicant_birth_day,
            app.applicant_birth_month,
            app.applicant_birth_year
          ),
          "Primary Applicant Email Address": app.applicant_email_address,
          "Primary Applicant Phone Number": app.applicant_phone_number,
          "Primary Applicant Phone Type": app.applicant_phone_number_type,
          "Primary Applicant Additional Phone Number": app.application_additional_phone_number,
          "Primary Applicant Preferred Contact Type": app.application_contact_preferences.join(","),
          "Primary Applicant Street": app.applicant_address_street,
          "Primary Applicant Street 2": app.applicant_address_street2,
          "Primary Applicant City": app.applicant_address_city,
          "Primary Applicant Zip Code": app.applicant_address_zip_code,
          "Primary Applicant State": app.applicant_address_state,
          "Primary Applicant Mailing Street": app.mailingAddress_street,
          "Primary Applicant Mailing Street 2": app.mailingAddress_street2,
          "Primary Applicant Mailing City": app.mailingAddress_city,
          "Primary Applicant Mailing Zip Code": app.mailingAddress_zip_code,
          "Primary Applicant Mailing State": app.mailingAddress_state,
          "Primary Applicant Work Street": app.applicant_workAddress_street,
          "Primary Applicant Work Street 2": app.applicant_workAddress_street2,
          "Primary Applicant Work City": app.applicant_workAddress_city,
          "Primary Applicant Work Zip Code": app.applicant_workAddress_zip_code,
          "Primary Applicant Work State": app.applicant_workAddress_state,
          "Alternate Contact First Name": app.alternateContact_first_name,
          "Alternate Contact Middle Name": app.alternateContact_middle_name,
          "Alternate Contact Last Name": app.alternateContact_last_name,
          "Alternate Contact Type": app.alternateContact_type,
          "Alternate Contact Agency": app.alternateContact_agency,
          "Alternate Contact Other Type": app.alternateContact_other_type,
          "Alternate Contact Email Address": app.alternateContact_email_address,
          "Alternate Contact Phone Number": app.alternateContact_phone_number,
          "Alternate Contact Street": app.alternateContact_mailingAddress_street,
          "Alternate Contact Street 2": app.alternateContact_mailingAddress_street2,
          "Alternate Contact City": app.alternateContact_mailingAddress_city,
          "Alternate Contact Zip Code": app.alternateContact_mailingAddress_zip_code,
          "Alternate Contact State": app.alternateContact_mailingAddress_state,
          Income: app.application_income,
          "Income Period": app.application_income_period === "perMonth" ? "per month" : "per year",
          "Accessibility Mobility": this.csvBuilder.formatBoolean(app.accessibility_mobility),
          "Accessibility Vision": this.csvBuilder.formatBoolean(app.accessibility_vision),
          "Accessibility Hearing": this.csvBuilder.formatBoolean(app.accessibility_hearing),
          "Vouchers or Subsidies": this.csvBuilder.formatBoolean(app.application_income_vouchers),
          "Requested Unit Types": {
            [app.preferredUnit_id]: this.unitTypeToReadable(app.preferredUnit_name),
          },
          Preference: app.application_preferences.reduce((obj, preference) => {
            const root = this.csvBuilder.capAndSplit(preference.key)
            preference.options.forEach((option) => {
              const key = `${root}: ${this.csvBuilder.capAndSplit(option.key)}`
              preferenceKeys[key] = 1
              if (option.checked) {
                obj[key] = "claimed"
              }
              if (option.extraData?.length) {
                const extraKey = `${key} - ${option.extraData.map((obj) => obj.key).join(" and ")}`
                let extraString = ""
                option.extraData.forEach((extra) => {
                  if (extra.type === "text") {
                    extraString += `${capitalizeFirstLetter(extra.key)}: ${extra.value}, `
                  } else if (extra.type === "address") {
                    extraString += `Street: ${extra.value.street}, Street 2: ${extra.value.street2}, City: ${extra.value.city}, State: ${extra.value.state}, Zip Code: ${extra.value.zipCode}`
                  }
                })
                preferenceKeys[extraKey] = 1
                obj[extraKey] = extraString
              }
            })
            return obj
          }, {}),
          "Household Size": app.application_household_size,
          "Household Members": {
            [app.householdMembers_id]: this.mapHouseholdMembers(app),
          },
          "Marked As Duplicate": this.csvBuilder.formatBoolean(app.application_marked_as_duplicate),
          "Flagged As Duplicate": this.csvBuilder.formatBoolean(app.flagged),
          ...demographics,
        }
        /**
         * For all conditionals below, these are for mapping the n-many relationships that applications have (since we're getting the raw query).
         * While we're going through here, keep track of the extra keys created, so we don't have to loop through an extra time to create the headers
         */
      } else if (
        obj[app.application_id]["Household Members"][app.householdMembers_id] === undefined
      ) {
        obj[app.application_id]["Household Members"][
          app.householdMembers_id
        ] = this.mapHouseholdMembers(app)
        extraHeaders["Household Members"] = Math.max(
          1,
          Object.keys(obj[app.application_id]["Household Members"]).length
        )
      } else if (
        obj[app.application_id]["Requested Unit Types"][app.preferredUnit_id] === undefined
      ) {
        obj[app.application_id]["Requested Unit Types"][
          app.preferredUnit_id
        ] = this.unitTypeToReadable(app.preferredUnit_name)
      }
      return obj
    }, {})

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    function extraGroupKeys(group, obj) {
      const groups = {
        "Household Members": {
          nested: true,
          keys: Object.keys(self.mapHouseholdMembers(obj)),
        },
        Preference: {
          nested: false,
          keys: Object.keys(preferenceKeys),
        },
      }
      return groups[group]
    }

    return this.csvBuilder.buildFromIdIndex(applicationsObj, extraHeaders, extraGroupKeys)
  }
}
