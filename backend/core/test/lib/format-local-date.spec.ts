import { formatLocalDate } from "../../src/shared/utils/format-local-date"

declare const expect: jest.Expect

describe("formatLocalDate", () => {
  test("with an empty date string", () => {
    expect(formatLocalDate("", "MM-DD-YYYY hh:mm:ssA z", "America/Detroit")).toEqual("")
  })
  test("with a format and no timezone", () => {
    expect(formatLocalDate("2023-04-01T17:00:00.000Z", "MM-DD-YYYY hh:mm:ssA")).toEqual(
      "04-01-2023 05:00:00PM"
    )
  })
  test("with a format and timezone", () => {
    expect(
      formatLocalDate("2023-04-01T17:00:00.000Z", "MM-DD-YYYY hh:mm:ssA z", "America/Detroit")
    ).toEqual("04-01-2023 01:00:00PM EDT")
  })
})
