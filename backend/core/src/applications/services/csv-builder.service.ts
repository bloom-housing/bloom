/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Scope } from "@nestjs/common"

export interface KeyNumber {
  [key: string]: number
}

@Injectable({ scope: Scope.REQUEST })
export class CsvBuilder {
  /**
   * this assumes a flat file structure since it's getting fed data from a raw query
   * relational data should be handled with the use of extraHeaders and extraGroupKeys,
   * see application-csv-exporter Household Members for an example of this
   * All formatting should be done before passing in
   */
  public buildFromIdIndex(
    obj: { [key: string]: any },
    extraHeaders?: { [key: string]: number },
    extraGroupKeys?: (
      group: string,
      obj?: { [key: string]: any }
    ) => { nested: boolean; keys: string[] }
  ): string {
    const headerIndex: { [key: string]: number } = {}
    // rootKeys should be the ids
    const rootKeys = Object.keys(obj)

    if (rootKeys.length === 0) return ""
    /**
     * initialApp should have all possible keys.
     * If it can't, use extraHeaders
     */
    const initialApp = obj[rootKeys[0]]
    let index = 0
    // set headerIndex
    Object.keys(initialApp).forEach((key) => {
      // if the key is in extra headers, we want to group them all together
      if (extraHeaders && extraHeaders[key] && extraGroupKeys) {
        const groupKeys = extraGroupKeys(key, initialApp)
        for (let i = 1; i < extraHeaders[key] + 1; i++) {
          const headerGroup = groupKeys.nested ? `${key} (${i})` : key
          groupKeys.keys.forEach((groupKey) => {
            headerIndex[`${headerGroup} ${groupKey}`] = index
            index++
          })
        }
      } else {
        headerIndex[key] = index
        index++
      }
    })
    const headers = Object.keys(headerIndex)

    // initiate arrays to insert data
    const rows = Array.from({ length: rootKeys.length }, () => Array(headers.length))

    // set rows (a row is a record)
    rootKeys.forEach((obj_id, row) => {
      const thisObj = obj[obj_id]
      Object.keys(thisObj).forEach((key) => {
        const val = thisObj[key]
        const groupKeys = extraGroupKeys && extraGroupKeys(key, initialApp)
        if (extraHeaders && extraHeaders[key] && groupKeys) {
          // val in this case is an object with ids as the keys
          const ids = Object.keys(val)
          if (groupKeys.nested && ids.length) {
            Object.keys(val).forEach((sub_id, i) => {
              const headerGroup = `${key} (${i + 1})`
              groupKeys.keys.forEach((groupKey) => {
                const column = headerIndex[`${headerGroup} ${groupKey}`]
                const sub_val = val[sub_id][groupKey]
                rows[row][column] =
                  sub_val !== undefined && sub_val !== null
                    ? this.escapeDoubleQuotes(JSON.stringify(sub_val))
                    : ""
              })
            })
          } else if (groupKeys.nested === false) {
            Object.keys(val).forEach((sub_key) => {
              const column = headerIndex[`${key} ${sub_key}`]
              const sub_val = val[sub_key]
              rows[row][column] =
                sub_val !== undefined && sub_val !== null
                  ? this.escapeDoubleQuotes(JSON.stringify(sub_val))
                  : ""
            })
          }
        } else {
          const column = headerIndex[key]
          let value
          if (Array.isArray(val)) {
            value = val.join(", ")
          } else if (val instanceof Object) {
            value = Object.keys(val)
              .map((key) => val[key])
              .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
              .join(", ")
          } else {
            value = val
          }
          rows[row][column] =
            value !== undefined && value !== null
              ? this.escapeDoubleQuotes(JSON.stringify(value))
              : ""
        }
      })
    })

    // this covers the case where a header has a comma or a double quote in its text
    // we use the csv spec and escape the comma by wrapping the whole thing in double quotes
    // we use the csv spec and escape the double quotes by use a second set of double quotes
    let csvString = headers.reduce((accumulator, curr) => {
      return `${accumulator}${accumulator.length ? "," : ""}"${curr.replace(/"/g, `""`)}"`
    }, "")
    csvString += "\n"

    // turn rows into csv format
    rows.forEach((row) => {
      if (row.length) {
        csvString += row.join(",")
        csvString += "\n"
      }
    })

    return csvString
  }

  private escapeDoubleQuotes(data: string) {
    return data.replace(/\\"/g, `""`)
  }
}
