/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvEncoder } from "./csv-encoder.service"
import { ApplicationDto } from "../applications/dto/application.dto"
import { capitalizeFirstLetter } from "../libs/stringLib"

const HEADER_COUNT_REG = new RegExp(/\s\(\d\)/)

@Injectable()
export class CsvBuilder {
  headers: { [key: string]: number }
  data: { header: string; mappedField: string; val: any }[]
  inProgress: boolean
  excludeKeys: string[]
  mappedFields: { [key: string]: string }
  constructor(private readonly csvEncoder: CsvEncoder) {
    this.headers = {}
    this.data = []
    this.inProgress = false
    this.excludeKeys = [
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
    ]
    // preface fields with _[A-Z]_ to make sorting easier later
    this.mappedFields = {
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
    }
  }

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
      obj[`applicant ${field}`] = `_${sort}${i}_Primary Applicant ${this.capAndSplit(field)}`
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
      obj[`alternateContact ${field}`] = `_${sort}${i}_Alternate Contact ${this.capAndSplit(field)}`
    })

    return obj
  }

  private capAndSplit(str: string): string {
    let newStr = capitalizeFirstLetter(str)
    newStr = newStr.split(/(?=[A-Z])/).join(" ")
    return newStr
  }

  private setHeader(header: string, index: number): [string, string?] {
    let newKey = header
    // we pass along the mapped key for reference, so we can more easily set data to the correct column
    const test1 = this.mappedFields[header]
    const test2 = this.mappedFields[header.split(" ")[0]]
    let mappedStr = test1 ?? test2
    if (!test1 && test2) {
      const [, ...fields] = header.split(" ")
      if (fields) {
        fields.forEach((field) => {
          mappedStr += " " + this.capAndSplit(field)
        })
      }
    }

    if (index !== 0) {
      newKey += ` (${index})`
      if (mappedStr) {
        mappedStr += ` (${index})`
      }
    }
    if (this.headers[newKey] === undefined) {
      this.headers[newKey] = 1
    }
    return [newKey, mappedStr]
  }

  private resetData() {
    this.headers = {}
    this.data = []
  }

  private setProgress(inProgress: boolean) {
    this.inProgress = inProgress
  }

  private getExcludeKeysRegex() {
    return new RegExp(this.excludeKeys.join("|"))
  }

  private addToExlucdedKeys(key) {
    this.excludeKeys.push(key)
  }

  private parseApplication(key: string, val: any, header: string, index = 0): void {
    if (Array.isArray(val)) {
      val.forEach((val2, i) => {
        // preferences are a special case
        if (key === "preferences") {
          val2.options?.forEach((preference) => {
            this.parseApplication(
              preference.key,
              preference.checked ? "Yes" : "No",
              `${header} ${val2.key} ${preference.key}`
            )
          })
        } else {
          this.parseApplication(key, val2, header, i + 1)
        }
      })
    } else if (val instanceof Object) {
      // dates are objects
      if (dayjs(val).isValid()) {
        const [newKey, mappedField] = this.setHeader(header, index)
        this.data.push({
          header: newKey,
          mappedField,
          val: dayjs(val).format("DD-MM-YYYY h:mm:ss A"),
        })
      } else {
        for (let i = 0, keys = Object.keys(val); i < keys.length; i++) {
          this.parseApplication(
            keys[i],
            val[keys[i]],
            header.length ? `${header} ${keys[i]}` : keys[i],
            index
          )
        }
      }
    } else {
      const [newKey, mappedField] = this.setHeader(header, index)
      // format data before pushing
      if (typeof val === "boolean") {
        val = val ? "Yes" : "No"
      }
      // use JSON.stringify to escape double and single quotes
      this.data.push({
        header: newKey,
        mappedField,
        val: val !== undefined && val !== null ? JSON.stringify(val) : "",
      })
    }
  }

  public build(arr: any[], includeDemographics?: boolean): string {
    if (this.inProgress === true) {
      throw new HttpException(
        {
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: "Download Already in Progress",
        },
        HttpStatus.TOO_MANY_REQUESTS
      )
    }
    this.setProgress(true)
    let dataString = ""
    try {
      if (!includeDemographics) {
        this.addToExlucdedKeys("demographics")
      }
      arr.forEach((row: ApplicationDto) => {
        this.parseApplication("", row, "")
        this.data.push({ header: "_endRow", mappedField: undefined, val: "_endRow" })
      })

      // filter out excluded keys and fields not in mappedFields
      let headerArray = Object.keys(this.headers).filter((header) => {
        const mappedField =
          this.mappedFields[header.replace(HEADER_COUNT_REG, "")] ||
          this.mappedFields[header.split(" ")[0]]
        return !this.getExcludeKeysRegex().test(header) && mappedField
      })

      // initiate arrays to insert data
      const rows = Array.from({ length: arr.length }, () => Array(headerArray.length))

      headerArray = headerArray
        .map((column) => {
          let columnString = ""
          const test1 = this.mappedFields[column.replace(HEADER_COUNT_REG, "")]
          const test2 = this.mappedFields[column.split(" ")[0]]
          let mappedField = test1 ?? test2
          if (mappedField) {
            if (!test1 && test2) {
              const [, ...fields] = column.split(" ")
              fields.forEach((field) => {
                mappedField += " " + this.capAndSplit(field)
              })
            } else if (test1) {
              const columnCount = HEADER_COUNT_REG.exec(column)
              if (columnCount !== null) {
                mappedField += columnCount[0]
              }
            }
            columnString = mappedField
          } else {
            // format header names
            let columnArray = column.split(" ")
            columnArray = columnArray.map((str) => {
              let newStr = ""

              // capitalize and split camel cased
              newStr = this.capAndSplit(str)
              return newStr
            })

            columnString = columnArray.join(" ")
          }
          return columnString
        })
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

      let row = 0
      this.data.forEach((obj) => {
        if (obj.val === "_endRow") {
          row++
        } else {
          // get index of header
          const headerIndex = obj.mappedField
            ? headerArray.indexOf(obj.mappedField)
            : headerArray.indexOf(obj.header)

          if (headerIndex > -1) {
            rows[row][headerIndex] = obj.val
          }
        }
      })

      // turn headers into csv format
      dataString = headerArray.map((key) => key.replace(/^_[A-Z]\d?_/, "")).join(",")
      if (headerArray.length) {
        dataString += "\n"
      }

      // turn rows into csv format
      rows.forEach((row) => {
        if (row.length) {
          dataString += row.join(",")
          dataString += "\n"
        }
      })
    } catch (error) {
      console.log("CSV Export Error = ", error)
    }

    this.resetData()
    this.setProgress(false)

    return dataString
  }
}
