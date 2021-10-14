/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { ApplicationDto } from "../applications/dto/application.dto"
import { capitalizeFirstLetter } from "../libs/stringLib"

const HEADER_COUNT_REG = new RegExp(/\s\(\d\)/)

interface MappedFields {
  [key: string]: string
}

@Injectable({ scope: Scope.REQUEST })
export class CsvBuilder {
  headers: { [key: string]: number }
  parsedData: { header: string; mappedField: string; val: any }[]
  inProgress: boolean
  excludeKeys: string[]
  mappedFields: MappedFields
  constructor() {
    this.headers = {}
    this.parsedData = []
    this.inProgress = false
    this.excludeKeys = []
    this.mappedFields = {}
  }

  public capAndSplit(str: string): string {
    let newStr = capitalizeFirstLetter(str)
    newStr = newStr.split(/(?=[A-Z])/).join(" ")
    return newStr
  }

  public arrayToCapitalizedString(arr: string[]): string {
    return arr.map((val) => this.capAndSplit(val)).join(" ")
  }

  /**
   * this tests two cases of a header, static and dynamic
   * *
   * Headers like "applicant firstName" or "houseHoldMembers firstName (1)" are static
   * and headers like "preference <some other strings>" where it's defined off of the data.
   * So in the case of dynamic we're just checking the first string to see if it matches
   */
  private isHeaderInMappedFields(name): [string, string] {
    const staticHeader = this.mappedFields[name.replace(HEADER_COUNT_REG, "")]
    const dynamicHeader = this.mappedFields[name.split(" ")[0]]

    return [staticHeader, dynamicHeader]
  }

  /**
   * This builder supports mapped (static and dynamic) and non mapped keys.
   * For an example, using a mapped static header, we have the "applicant" object, which has
   * "firstName" as a key. Since we only call setHeader when we've gotten down to non objects,
   * it's finally called with setHeader("applicant firstName").
   * Since "applicant firstName" is a mappedField, meaning that mappedField["applicant firstName"] = "Primary Applicant First Name", we want to set the mappedStr to this and pass along to add to the pasredData object.
   * So that later, we can know what column the corresponding data goes in by that mapped field.
   */
  private setHeader(header: string, index: number): [string, string?] {
    let newKey = header
    // we pass along the mapped key for reference, so we can more easily set data to the correct column
    const [staticHeader, dynamicHeader] = this.isHeaderInMappedFields(header)
    let mappedStr = staticHeader ?? dynamicHeader
    if (!staticHeader && dynamicHeader) {
      const [, ...names] = header.split(" ")
      if (names) {
        mappedStr += " " + this.arrayToCapitalizedString(names)
      }
    }
    if (!mappedStr) {
      newKey = this.arrayToCapitalizedString(newKey.split(" "))
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

  private getExcludeKeysRegex() {
    return new RegExp(this.excludeKeys.join("|"))
  }

  public addToExcludedKeys(key) {
    this.excludeKeys.push(key)
  }

  public setExcludedKeys(keys: string[]) {
    this.excludeKeys = keys
  }

  public setMappedFields(obj: MappedFields) {
    this.mappedFields = obj
  }

  private parseData(key: string, val: any, header: string, index = 0): void {
    if (Array.isArray(val)) {
      val.forEach((val2, i) => {
        // preferences and programs are a special case
        // TODO: think of a better way to handle this case
        if (key === "preferences" || key === "programs") {
          val2.options?.forEach((preference) => {
            this.parseData(
              preference.key,
              preference.checked ? "Yes" : "No",
              `${header} ${val2.key} ${preference.key}`
            )
          })
        } else {
          this.parseData(key, val2, header, i + 1)
        }
      })
    } else if (val instanceof Object) {
      // dates are objects
      if (dayjs(val).isValid()) {
        const [newKey, mappedField] = this.setHeader(header, index)
        this.parsedData.push({
          header: newKey,
          mappedField,
          val: dayjs(val).format("DD-MM-YYYY h:mm:ss A"),
        })
      } else {
        for (let i = 0, keys = Object.keys(val); i < keys.length; i++) {
          this.parseData(
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
      this.parsedData.push({
        header: newKey,
        mappedField,
        val: val !== undefined && val !== null ? JSON.stringify(val) : "",
      })
    }
  }

  public build(arr: any[]): string {
    let csvString = ""
    try {
      arr.forEach((row: ApplicationDto) => {
        this.parseData("", row, "")
        this.parsedData.push({ header: "_endRow", mappedField: undefined, val: "_endRow" })
      })
      // filter out excluded keys and fields not in mappedFields (if mappedFields is not empty)
      const hasMappedFields = Object.keys(this.mappedFields).length > 0
      const hasExcludeKeys = this.excludeKeys.length > 0
      let headerArray = Object.keys(this.headers).filter((header) => {
        const mappedField = hasMappedFields
          ? this.mappedFields[header.replace(HEADER_COUNT_REG, "")] !== undefined ||
            this.mappedFields[header.split(" ")[0]] !== undefined
          : true
        return (hasExcludeKeys === false || !this.getExcludeKeysRegex().test(header)) && mappedField
      })
      // initiate arrays to insert data
      const rows = Array.from({ length: arr.length }, () => Array(headerArray.length))

      headerArray = headerArray
        .map((column) => {
          let columnString = ""
          const [staticHeader, dynamicHeader] = this.isHeaderInMappedFields(column)
          let mappedField = staticHeader ?? dynamicHeader
          if (mappedField) {
            if (!staticHeader && dynamicHeader) {
              const [, ...names] = column.split(" ")
              mappedField += " " + this.arrayToCapitalizedString(names)
            } else if (staticHeader) {
              const columnCount = HEADER_COUNT_REG.exec(column)
              if (columnCount !== null) {
                mappedField += columnCount[0]
              }
            }
            columnString = mappedField
          } else {
            // format header names
            const columnArray = column.split(" ")
            columnString = this.arrayToCapitalizedString(columnArray)
          }
          return columnString
        })
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      let row = 0
      this.parsedData.forEach((obj) => {
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
      csvString = headerArray.map((key) => key.replace(/^_[A-Z]\d?_/, "")).join(",")
      if (headerArray.length) {
        csvString += "\n"
      }

      // turn rows into csv format
      rows.forEach((row) => {
        if (row.length) {
          csvString += row.join(",")
          csvString += "\n"
        }
      })
    } catch (error) {
      console.log("CSV Export Error = ", error)
    }

    return csvString
  }
}
