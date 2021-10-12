import { Test, TestingModule } from "@nestjs/testing"
import { CsvBuilder } from "./csv-builder.service"
import { CsvEncoder } from "./csv-encoder.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("CSVBuilder", () => {
  let service: CsvBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvEncoder, CsvBuilder],
    }).compile()
    service = module.get<CsvBuilder>(CsvBuilder)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("create empty response", () => {
    const response = service.build([])
    expect(response).toBe("")
  })
  it("create correctly escaped CSV for correct data", () => {
    const response = service.build([{ id: "foo", income: "bar" }])
    expect(response).toBe('Application Number,Income\n"foo","bar"\n')
  })
  it("create CSV and convert boolean to yes/no", () => {
    const response = service.build([{ markedAsDuplicate: true, flagged: false }])
    expect(response).toBe('Marked As Duplicate,Flagged As Duplicate\n"Yes","No"\n')
  })
  it("create CSV with escaped double quotes", () => {
    const response = service.build([{ "applicant firstName": '"', "applicant lastName": "bar" }])
    expect(response).toBe('Primary Applicant First Name,Primary Applicant Last Name\n"\\"","bar"\n')
  })
  it("create CSV with comma in value", () => {
    const response = service.build([
      { "applicant firstName": "with, comma", "applicant lastName": "should work," },
    ])
    expect(response).toBe(
      'Primary Applicant First Name,Primary Applicant Last Name\n"with, comma","should work,"\n'
    )
  })
  it("create an CSV for undefined fields", () => {
    const response = service.build([{}])
    expect(response).toBe("")
  })
  it("create a CSV with nested objects", () => {
    const response = service.build([{ demographics: { bar: 1, baz: 2 } }], true)
    expect(response).toBe("Demographics Bar,Demographics Baz\n1,2\n")
  })
  it("create a CSV with an array of strings", () => {
    const response = service.build([{ householdMembers: ["foo", "bar"] }])
    expect(response).toBe('Household Members (1),Household Members (2)\n"foo","bar"\n')
  })
  it("create a correct CSV for array type of metadata", () => {
    const response = service.build([{ householdMembers: [{ foo: "foo" }, { foo: "foo 2" }] }])
    expect(response).toBe('Household Members Foo (1),Household Members Foo (2)\n"foo","foo 2"\n')
  })
  it("create an empty CSV for array type of metadata for undefined input array", () => {
    const response = service.build([])
    expect(response).toBe("")
  })
  it("create a CSV for array type of metadata for null input array", () => {
    const response = service.build([{ householdMembers: null }])
    expect(response).toBe("Household Members\n\n")
  })
  it("create an empty CSV for array type of metadata for empty input array", () => {
    const response = service.build([{ householdMembers: [] }])
    expect(response).toBe("")
  })
  it("create an empty CSV if nested objects are empty", () => {
    const response = service.build([{ householdMembers: [{}] }])
    expect(response).toBe("")
  })
  it("create a correct CSV for type of preferences", () => {
    const response = service.build([
      { preferences: [{ key: "foo", options: [{ key: "bar", checked: true }] }] },
    ])
    expect(response).toBe('Preferences Foo Bar\n"Yes"\n')
  })
  it("should return empty if keys are not in mappedFields", () => {
    const response = service.build([{ arr: [{ foo: null }] }])
    expect(response).toBe("")
  })
  it("should sort according to mappedFields", () => {
    const response = service.build([{ submissionType: "bar", id: "foo" }])
    expect(response).toBe('Application Number,Application Type\n"foo","bar"\n')
  })
})
