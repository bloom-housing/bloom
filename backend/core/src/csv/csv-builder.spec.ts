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
    expect(response).toBe("\n")
  })
  it("create correctly escaped CSV for correct data", () => {
    const response = service.build([{ foo: "foo", bar: "bar" }])
    expect(response).toBe('Bar,Foo\n"bar","foo"\n')
  })
  it("create CSV and convert boolean to yes/no", () => {
    const response = service.build([{ foo: true, bar: false }])
    expect(response).toBe('Bar,Foo\n"No","Yes"\n')
  })
  it("create CSV with escaped double quotes", () => {
    const response = service.build([{ foo: '"', bar: "bar" }])
    expect(response).toBe('Bar,Foo\n"bar","\\""\n')
  })
  it("create CSV with comma in value", () => {
    const response = service.build([{ foo: "with, comma", bar: "should work," }])
    expect(response).toBe('Bar,Foo\n"should work,","with, comma"\n')
  })
  it("create an CSV for undefined fields", () => {
    const response = service.build([{}])
    expect(response).toBe("\n\n")
  })
  it("create a CSV with nested objects", () => {
    const response = service.build([{ foo: { bar: 1, baz: 2 } }])
    expect(response).toBe("Foo Bar,Foo Baz\n1,2\n")
  })
  it("create a CSV with an array of strings", () => {
    const response = service.build([{ arr: ["foo", "bar"] }])
    expect(response).toBe('Arr (1),Arr (2)\n"foo","bar"\n')
  })
  it("create a correct CSV for array type of metadata", () => {
    const response = service.build([{ arr: [{ foo: "foo" }, { foo: "foo 2" }] }])
    expect(response).toBe('Arr Foo (1),Arr Foo (2)\n"foo","foo 2"\n')
  })
  it("create an empty CSV for array type of metadata for undefined input array", () => {
    const response = service.build([])
    expect(response).toBe("\n")
  })
  it("create a CSV for array type of metadata for null input array", () => {
    const response = service.build([{ arr: null }])
    expect(response).toBe("Arr\n\n")
  })
  it("create an empty CSV for array type of metadata for empty input array", () => {
    const response = service.build([{ arr: [] }])
    expect(response).toBe("\n\n")
  })
  it("create an empty CSV if nested objects are empty", () => {
    const response = service.build([{ arr: [{}] }])
    expect(response).toBe("\n\n")
  })
  it("create a correct CSV for array type of metadata for single malformed input array", () => {
    const response = service.build([{ arr: [{ foo: null }] }])
    expect(response).toBe("Arr Foo (1)\n\n")
  })
})
