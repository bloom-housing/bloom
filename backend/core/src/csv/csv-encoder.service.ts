import { Injectable } from "@nestjs/common"

@Injectable()
export class CsvEncoder {
  public encode(input: Array<Array<string>>, includeHeaders?: boolean): string {
    let output = ""

    if (input && !input.length) {
      return ""
    }
    this._validateInput(input)

    const headers = input.shift()
    if (includeHeaders && headers && Array.isArray(headers) && headers.length) {
      output += this._encode(headers)
      output += "\n"
    }

    for (const row of input) {
      if (row && Array.isArray(row) && row.length) {
        output += this._encode(row)
        output += "\n"
      }
    }

    return output
  }

  private _validateInput(input: Array<Array<string>>) {
    let cmp = input[0].length
    input.forEach((item) => {
      if (item.length != cmp) {
        throw new Error(
          "Unable to encode CSV - input rows are of different length. Check formatting metadata array."
        )
      }
      cmp = item.length
    })
  }

  private _encode(input: Array<string>): string {
    const encodedDoubleQuotesInput = input.map(
      (value) => '"' + this._encodeDoubleQuotes(value) + '"'
    )
    return encodedDoubleQuotesInput.join(",")
  }

  private _encodeDoubleQuotes(input: string) {
    const regex = /"/gi
    try {
      return input.replace(regex, '""')
    } catch (e) {
      return "null"
    }
  }
}
