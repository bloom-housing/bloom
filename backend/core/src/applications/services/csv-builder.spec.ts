import { Test, TestingModule } from "@nestjs/testing"
import { CsvBuilder } from "./csv-builder.service"
/* import { ApplicationCsvExporter } from "./application-csv-exporter"
import { ApplicationStatus } from "../applications/types/application-status-enum"
import { ApplicationSubmissionType } from "../applications/types/application-submission-type-enum" */

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("CSVBuilder", () => {
  let service: CsvBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvBuilder],
    }).compile()
    service = await module.resolve<CsvBuilder>(CsvBuilder)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("create empty respsone", () => {
    const response = service.buildFromIdIndex({})
    expect(response).toBe("")
  })

  it("create correctly escaped CSV for correct data", () => {
    const response = service.buildFromIdIndex({ 1: { foo: "bar", bar: "foo" }, 2: { bar: "baz" } })
    expect(response).toBe('foo,bar\n"bar","foo"\n,"baz"\n')
  })

  it("create correct CSV for correct data with undefined value", () => {
    const response = service.buildFromIdIndex({
      1: { foo: "bar", bar: undefined },
      2: { bar: "baz" },
    })
    expect(response).toBe('foo,bar\n"bar",\n,"baz"\n')
  })

  it("create correct CSV for correct data with null value", () => {
    const response = service.buildFromIdIndex({
      1: { foo: "bar", bar: null },
      2: { bar: "baz" },
    })
    expect(response).toBe('foo,bar\n"bar",\n,"baz"\n')
  })

  it("create CSV with escaped double quotes", () => {
    const response = service.buildFromIdIndex({ 1: { foo: '"', bar: "foo" } })
    expect(response).toBe('foo,bar\n"\\"","foo"\n')
  })

  it("create CSV with comma in value", () => {
    const response = service.buildFromIdIndex({ 1: { foo: "with, comma", bar: "should work," } })
    expect(response).toBe('foo,bar\n"with, comma","should work,"\n')
  })

  it("create a CSV with an array of strings", () => {
    const response = service.buildFromIdIndex({ 1: { foo: ["foo", "bar"] } })
    expect(response).toBe('foo\n"foo, bar"\n')
  })

  it("create a CSV with a nested object of key: string pairs that converts it to an array", () => {
    const response = service.buildFromIdIndex({
      1: { foo: "bar", bar: { 1: "bar-sub-1", 2: "bar-sub-2" } },
    })
    expect(response).toBe('foo,bar\n"bar","bar-sub-1, bar-sub-2"\n')
  })

  it("create CSV with extraHeaders and nested groupKeys", () => {
    const response = service.buildFromIdIndex(
      {
        1: { foo: "bar", bar: "foo", baz: { 1: { sub: "sub-foo" }, 2: { sub: "sub-bar" } } },
      },
      { baz: 2 },
      (group) => {
        const groups = {
          baz: {
            nested: true,
            keys: ["sub"],
          },
        }

        return groups[group]
      }
    )
    expect(response).toBe('foo,bar,baz (1) sub,baz (2) sub\n"bar","foo","sub-foo","sub-bar"\n')
  })

  it("create CSV with extraHeaders and non nested groupKeys", () => {
    const response = service.buildFromIdIndex(
      {
        1: { foo: "bar", bar: "foo", baz: { sub: "baz-sub", bus: "baz-bus" } },
      },
      { baz: 1 },
      (group) => {
        const groups = {
          baz: {
            nested: false,
            keys: ["sub", "bus"],
          },
        }

        return groups[group]
      }
    )
    expect(response).toBe('foo,bar,baz sub,baz bus\n"bar","foo","baz-sub","baz-bus"\n')
  })
})

// TODO: add tests specific to ApplicationCsvExporter
/* describe("ApplicationCsvExporter", () => {
  let service: ApplicationCsvExporter
  const now = new Date()

  const BASE_ADDRESS = {
    city: "city",
    state: "state",
    street: "street",
    zipCode: "zipcode",
  }

  const BASE_APPLICATIONS = [
    {
      id: "app_1",
      listingId: "listing_1",
      applicant: {
        id: "applicant_1",
        firstName: "first name",
        middleName: "middle name",
        lastName: "last name",
        address: {
          id: "address_1",
          createdAt: now,
          updatedAt: now,
          ...BASE_ADDRESS,
        },
        workAddress: {
          id: "work_address_1",
          createdAt: now,
          updatedAt: now,
          ...BASE_ADDRESS,
        },
        createdAt: now,
        updatedAt: now,
      },
      contactPreferences: [],
      updatedAt: now,
      createdAt: now,
      mailingAddress: {
        id: "mailing_address_1",
        createdAt: now,
        updatedAt: now,
        ...BASE_ADDRESS,
      },
      alternateAddress: {
        id: "alternate_address_1",
        createdAt: now,
        updatedAt: now,
        ...BASE_ADDRESS,
      },
      alternateContact: {
        id: "alternate_contact_1",
        createdAt: now,
        updatedAt: now,
        mailingAddress: {
          id: "mailing_address_2",
          createdAt: now,
          updatedAt: now,
          ...BASE_ADDRESS,
        },
      },
      accessibility: {
        id: "accessibility_1",
        createdAt: now,
        updatedAt: now,
      },
      demographics: {
        howDidYouHear: ["ears"],
        id: "demographics_1",
        createdAt: now,
        updatedAt: now,
      },
      householdMembers: [],
      preferredUnit: [],
      preferences: [],
      status: ApplicationStatus.submitted,
      submissionType: ApplicationSubmissionType.electronical,
      markedAsDuplicate: false,
      flagged: false,
      confirmationCode: "code_1",
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvBuilder, ApplicationCsvExporter],
    }).compile()
    service = module.get<ApplicationCsvExporter>(ApplicationCsvExporter)
  })
}) */
