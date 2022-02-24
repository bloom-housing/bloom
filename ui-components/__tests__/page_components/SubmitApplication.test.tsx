import React from "react"
import { render, cleanup } from "@testing-library/react"
import {
  AllFields,
  DropOffNoOfficeHours,
  MailingNoPostmarks,
  MailingNoPostmarksYesDueDate,
  MailingWithPostmarks,
  MailingYesPostmarksNoDueDate,
} from "../../src/page_components/listing/listing_sidebar/SubmitApplication.stories"

afterEach(cleanup)
// TODO: there aren't translations for these in Detroit
describe.skip("<ApplicationAddresses>", () => {
  it("includes mailing address, includes drop off address, includes due date, includes postmarks, includes office hours", () => {
    const { getByText } = render(<AllFields />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021",
        { exact: false }
      )
    ).toBeTruthy()
    expect(getByText("or")).toBeTruthy()
    expect(getByText("Drop Off Application")).toBeTruthy()
    expect(getByText("Drop Off Address Street")).toBeTruthy()
    expect(getByText("Office Hours")).toBeTruthy()
  })
  it("excludes mailing address, include drop off address, excludes office hours", () => {
    const { getByText, queryByText } = render(<DropOffNoOfficeHours />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(queryByText("Send Application by US Mail")).toBe(null)
    expect(queryByText("or")).toBe(null)
    expect(getByText("Drop Off Application")).toBeTruthy()
    expect(getByText("Drop Off Address Street")).toBeTruthy()
    expect(queryByText("Office Hours")).toBe(null)
  })
  it("includes mailing address, excludes dropoff address, excludes postmarks, excludes due date", () => {
    const { getByText, queryByText } = render(<MailingNoPostmarks />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(getByText("Developer is not responsible for lost or delayed mail.")).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
  it("includes mailing address, excludes dropoff address, includes postmarks, includes due date", () => {
    const { getByText, queryByText } = render(<MailingWithPostmarks />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
  it("includes mailing address, excludes dropoff address, includes postmarks, excludes due date", () => {
    const { getByText, queryByText } = render(<MailingYesPostmarksNoDueDate />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be received by mail no later than November 30th, 2021. Applications received after November 30th, 2021 via mail will not be accepted. Developer is not responsible for lost or delayed mail.",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
  it("includes mailing address, excludes dropoff address, excludes postmarks, includes due date", () => {
    const { getByText, queryByText } = render(<MailingNoPostmarksYesDueDate />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street")).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021. Developer is not responsible for lost or delayed mail.",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
})
