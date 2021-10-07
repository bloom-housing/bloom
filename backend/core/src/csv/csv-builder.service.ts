/* eslint-disable @typescript-eslint/no-explicit-any */
import { CsvEncoder } from "./csv-encoder.service"
import { Injectable } from "@nestjs/common"
import dayjs from "dayjs"
import { ApplicationDto } from "../applications/dto/application.dto"

@Injectable()
export class CsvBuilder {
  headers: { [key: string]: number }
  data: { header: string; val: any }[]
  constructor(private readonly csvEncoder: CsvEncoder) {
    this.headers = {}
    this.data = []
  }

  private setHeader(key: string, header: string, index: number): string {
    let newKey = header.length ? `${header} ${key}` : key
    if (index !== 0) {
      newKey += ` ${index}`
    }
    if (this.headers[newKey] === undefined) {
      this.headers[newKey] = 1
    }

    return newKey
  }

  private parseApplication(key: string, val: any, header: string, index = 0): void {
    if (Array.isArray(val)) {
      val.forEach((val2, i) => {
        // preferences are a special case
        if (key === "preferences") {
          val2.options.forEach((preference, j) => {
            this.parseApplication(
              preference.key,
              preference.checked ? "Yes" : "No",
              `${key} ${val2.key}`
            )
          })
        } else {
          this.parseApplication(key, val2, `${header} ${key}`, i + 1)
        }
      })
    } else if (val instanceof Object) {
      // dates are objects
      if (dayjs(val).isValid()) {
        const newKey = this.setHeader(key, header, index)
        this.data.push({ header: newKey, val: dayjs(val).format("DD-MM-YYYY h:mm:ss A") })
      } else {
        for (let i = 0, keys = Object.keys(val); i < keys.length; i++) {
          this.parseApplication(keys[i], val[keys[i]], key)
        }
      }
    } else {
      const newKey = this.setHeader(key, header, index)

      // format data before pushing
      if (typeof val === "boolean") {
        val = val ? "Yes" : "No"
      }

      this.data.push({ header: newKey, val })
    }
  }

  public build(arr: any[]): string {
    arr.forEach((row: ApplicationDto) => {
      this.parseApplication("", row, "")
      this.data.push({ header: "_endRow", val: "_endRow" })
    })

    // headers to sorted array
    const headerArray = Object.keys(this.headers)
      // filter out unwanted keys
      .filter(
        (header) =>
          !/\sid|createdAt|confirmationCode|deletedAt|listingId|updatedAt|userId/.test(header)
      )
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

    // initiate arrays to insert data
    const rows = Array.from({ length: arr.length }, () => Array(headerArray.length))

    // turn headers into csv format
    let dataString = headerArray
      .map((column) => {
        // format header names
        // let name = column.split(/(?=[A-Z])/).j
        let columnArray = column.split(" ")
        columnArray = columnArray.map((str) => {
          // capitalize and split camel cased
          let newStr = str.charAt(0).toUpperCase() + str.slice(1)
          newStr = newStr.split(/(?=[A-Z])/).join(" ")
          return newStr
        })

        return columnArray.join(" ")
      })
      .join(",")
    dataString += "\n"

    let row = 0
    this.data.forEach((obj) => {
      if (obj.val === "_endRow") {
        row++
      } else {
        // get index of header
        const headerIndex = headerArray.indexOf(obj.header)
        if (headerIndex > -1) {
          rows[row][headerIndex] = obj.val
        }
      }
    })
    // turn rows into csv format
    rows.forEach((row) => {
      dataString += row.join(",")
      dataString += "\n"
    })
    return dataString
  }
}
