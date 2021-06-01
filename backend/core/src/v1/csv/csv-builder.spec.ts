import { Test, TestingModule } from "@nestjs/testing"
import { CsvBuilder } from "./csv-builder.service"
import { CsvEncoder } from "./csv-encoder.service"
import { CSVFormattingType } from "./types/csv-formatting-type-enum"
import { FormattingMetadataAggregateFactory } from "./types/formatting-metadata-aggregate-factory"
import { defaultFormatter } from "./formatting/formatters"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const testMetadataAggregateFactory: FormattingMetadataAggregateFactory = () => {
  return [
    {
      discriminator: "foo",
      formatter: defaultFormatter,
      label: "Foo",
      type: undefined,
    },
    {
      discriminator: "bar",
      formatter: defaultFormatter,
      label: "Bar",
      type: undefined,
    },
  ]
}
const testMetadataAggregateWithArrayFactory: FormattingMetadataAggregateFactory = () => {
  return [
    {
      discriminator: "arr",
      type: "array",
      size: null,
      items: [
        {
          formatter: defaultFormatter,
          discriminator: "foo",
          label: "Foo",
        },
      ],
    },
  ]
}

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
    const response = service.build([], () => [], CSVFormattingType.basic, false)
    expect(response).toBe("")
  })
  it("create only headers for empty data array", () => {
    const response = service.build([], testMetadataAggregateFactory, CSVFormattingType.basic, true)
    expect(response).toBe('"Foo","Bar"\n')
  })
  it("should not include headers when such option is specified", () => {
    const response = service.build([], testMetadataAggregateFactory, CSVFormattingType.basic, false)
    expect(response).toBe("")
  })
  it("create correctly escaped CSV for correct data", () => {
    const response = service.build(
      [{ foo: "foo", bar: "bar" }],
      testMetadataAggregateFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo","Bar"\n"foo","bar"\n')
  })
  it("create CSV with escaped double quotes", () => {
    const response = service.build(
      [{ foo: '"', bar: "bar" }],
      testMetadataAggregateFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo","Bar"\n"""","bar"\n')
  })
  it("create create a correct CSV for undefined fields", () => {
    const response = service.build(
      [{}],
      testMetadataAggregateFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo","Bar"\n"",""\n')
  })
  it("create create a correct CSV for array type of metadata", () => {
    const response = service.build(
      [{ arr: [{ foo: "foo" }, { foo: "foo 2" }] }],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo (1)","Foo (2)"\n"foo","foo 2"\n')
  })
  it("create an empty CSV for array type of metadata for undefined input array", () => {
    const response = service.build(
      [],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe("")
  })
  it("create an empty CSV for array type of metadata for null input array", () => {
    const response = service.build(
      [{ arr: null }],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe("")
  })
  it("create an empty CSV for array type of metadata for empty input array", () => {
    const response = service.build(
      [{ arr: [] }],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe("")
  })
  it("create an a correct CSV for array type of metadata for single input array", () => {
    const response = service.build(
      [{ arr: [{}] }],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo (1)"\n""\n')
  })
  it("create an a correct CSV for array type of metadata for single malformed input array", () => {
    const response = service.build(
      [{ arr: [{ foo: null }] }],
      testMetadataAggregateWithArrayFactory,
      CSVFormattingType.basic,
      true
    )
    expect(response).toBe('"Foo (1)"\n""\n')
  })
})
