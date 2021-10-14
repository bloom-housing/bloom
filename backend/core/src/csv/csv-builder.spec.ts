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

  it("create empty response", () => {
    const response = service.build([])
    expect(response).toBe("")
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
    expect(response).toBe("")
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
    const response = service.build([{ arr: [{ fooBar: "foo" }, { fooBar: "foo 2" }] }])
    expect(response).toBe('Arr Foo Bar (1),Arr Foo Bar (2)\n"foo","foo 2"\n')
  })
  it("create an empty CSV for array type of metadata for undefined input array", () => {
    const response = service.build([])
    expect(response).toBe("")
  })
  it("create a CSV for array type of metadata for null input array", () => {
    const response = service.build([{ arr: null }])
    expect(response).toBe("Arr\n\n")
  })
  it("create an empty CSV for array type of metadata for empty input array", () => {
    const response = service.build([{ arr: [] }])
    expect(response).toBe("")
  })
  it("create an empty CSV if nested objects are empty", () => {
    const response = service.build([{ arr: [{}] }])
    expect(response).toBe("")
  })
  it("create a correct CSV for array type of metadata for single malformed input array", () => {
    const response = service.build([{ arr: [{ foo: null }] }])
    expect(response).toBe("Arr Foo (1)\n\n")
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

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("create empty response", () => {
    const response = service.export([])
    expect(response).toBe("")
  })

  it("export application with base fields", () => {
    const response = service.export(BASE_APPLICATIONS, false)
    console.log("response = ", response)
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
}) */
