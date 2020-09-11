import { Injectable } from "@nestjs/common"

@Injectable()
export class CsvEncoder {
  public encode(input: Array<Array<string>>, includeHeaders?: boolean): string {
    let output = ""

    const headers = input.shift()

    if (includeHeaders) {
      output += this._encode(headers)
      output += "\n"
    }

    for (const row of input) {
      output += this._encode(row)
      output += "\n"
    }
    return output
  }

  private _encode(input: Array<string>): string {
    const encodedDoubleQuotesInput = input.map(
      (value) => '"' + this._encodeDoubleQuotes(value) + '"'
    )
    return encodedDoubleQuotesInput.join(",")
  }

  private _encodeDoubleQuotes(input: string) {
    const regex = /"/gi
    return input.replace(regex, '""')
  }
}
