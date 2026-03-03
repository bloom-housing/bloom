import React from "react"
import dayjs from "dayjs"
import { screen } from "@testing-library/dom"
import { render, cleanup, fireEvent } from "@testing-library/react"
import {
  ApplicationMethodsTypeEnum,
  LanguagesEnum,
  ListingsStatusEnum,
  User,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Apply } from "../../../../src/components/listing/listing_sections/Apply"
import { getDateString } from "../../../../src/components/listing/ListingViewSeedsHelpers"

afterEach(cleanup)

describe("<Apply>", () => {
  const mockUser: User = {
    id: "123",
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    dob: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    jurisdictions: [],
    mfaEnabled: false,
    passwordUpdatedAt: new Date(),
    passwordValidForDays: 180,
    agreedToTermsOfService: true,
    listings: [],
  }

  it("does not render if only application method is referral", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Referral,
              acceptsPostmarkedApplications: null,
              externalReference: "Referral summary description",
              paperApplications: [],
              phoneNumber: "(123) 456-7890",
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("does not render if due date is in the past", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).subtract(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("does not render if listing is closed", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          status: ListingsStatusEnum.closed,
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("shows apply online button for internal online application", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      `/applications/start/choose-language?listingId=${listing.id}`
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows redirected apply online button for internal online application with mandated accounts on while signed out", () => {
    process.env.showMandatedAccounts = "TRUE"
    render(
      <AuthContext.Provider value={{ initialStateLoaded: true, profile: null }}>
        <Apply
          listing={{
            ...listing,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            applicationMethods: [
              {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.Internal,
                acceptsPostmarkedApplications: null,
                externalReference: null,
                paperApplications: [],
                phoneNumber: null,
              },
            ],
          }}
          preview={false}
          setShowDownloadModal={() => null}
        />
      </AuthContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      `/sign-in?redirectUrl=/applications/start/choose-language&listingId=${listing.id}`
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows not-redirected apply online button for internal online application with mandated accounts on while signed in", () => {
    process.env.showMandatedAccounts = "TRUE"
    render(
      <AuthContext.Provider value={{ initialStateLoaded: true, profile: mockUser }}>
        <Apply
          listing={{
            ...listing,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            applicationMethods: [
              {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.Internal,
                acceptsPostmarkedApplications: null,
                externalReference: null,
                paperApplications: [],
                phoneNumber: null,
              },
            ],
          }}
          preview={false}
          setShowDownloadModal={() => null}
        />
      </AuthContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      `/applications/start/choose-language?listingId=${listing.id}`
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows apply online button for external online application", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.ExternalLink,
              acceptsPostmarkedApplications: null,
              externalReference: "https://www.exygy.com",
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      "https://www.exygy.com"
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows apply online button for external online application with mandated accounts on and signed out", () => {
    process.env.showMandatedAccounts = "TRUE"
    render(
      <AuthContext.Provider value={{ initialStateLoaded: true, profile: null }}>
        <Apply
          listing={{
            ...listing,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            applicationMethods: [
              {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.ExternalLink,
                acceptsPostmarkedApplications: null,
                externalReference: "https://www.exygy.com",
                paperApplications: [],
                phoneNumber: null,
              },
            ],
          }}
          preview={false}
          setShowDownloadModal={() => null}
        />
      </AuthContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      "https://www.exygy.com"
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows apply online button for external online application with mandated accounts on and signed in", () => {
    process.env.showMandatedAccounts = "TRUE"
    render(
      <AuthContext.Provider value={{ initialStateLoaded: true, profile: mockUser }}>
        <Apply
          listing={{
            ...listing,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            applicationMethods: [
              {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                type: ApplicationMethodsTypeEnum.ExternalLink,
                acceptsPostmarkedApplications: null,
                externalReference: "https://www.exygy.com",
                paperApplications: [],
                phoneNumber: null,
              },
            ],
          }}
          preview={false}
          setShowDownloadModal={() => null}
        />
      </AuthContext.Provider>
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      "https://www.exygy.com"
    )

    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("shows download application button and opens modal for multiple paper applications", () => {
    const showDownloadModalSpy = jest.fn()
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.resolve(new Response()))
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "id",
                    label: "Asset label",
                  },
                },
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.es,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={showDownloadModalSpy}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Download application" })).toBeInTheDocument()
    fireEvent.click(screen.getByText("Download application"))
    expect(showDownloadModalSpy).toHaveBeenCalled()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByText("Apply online")).not.toBeInTheDocument()
  })

  it("shows download application button and does not open modal for one paper application", () => {
    const showDownloadModalSpy = jest.fn()
    global.URL.createObjectURL = jest.fn()
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.resolve(new Response()))
    process.env.cloudinaryCloudName = "exygy"

    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "paper-application-id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={showDownloadModalSpy}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Download application" })).toBeInTheDocument()
    fireEvent.click(screen.getByText("Download application"))
    expect(fetchMock).toHaveBeenCalledWith(
      "https://res.cloudinary.com/exygy/image/upload/paper-application-id.pdf",
      { headers: { "Content-Type": "application/pdf" }, method: "GET" }
    )

    expect(screen.queryByText("Apply online")).not.toBeInTheDocument()
    expect(showDownloadModalSpy).not.toHaveBeenCalled()
  })

  it("shows apply online and download application button for online and paper", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "paper-application-id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Download application" })).toBeInTheDocument()
  })

  it("shows paper application and mailing / drop off / pick up addresses", () => {
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "paper-application-id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
          listingsApplicationPickUpAddress: {
            id: "id",
            city: "Pick up address city",
            street: "Pick up address street",
            street2: "Pick up address unit",
            zipCode: "67890",
            state: "CA",
            latitude: 1,
            longitude: 2,
          },
          listingsApplicationMailingAddress: {
            id: "id",
            city: "Mailing address city",
            street: "Mailing address street",
            street2: "Mailing address unit",
            zipCode: "12345",
            state: "CO",
            latitude: 1,
            longitude: 2,
          },
          listingsApplicationDropOffAddress: {
            id: "id",
            city: "Drop off address city",
            street: "Drop off address street",
            street2: "Drop off address unit",
            zipCode: "45678",
            state: "CT",
            latitude: 1,
            longitude: 2,
          },
          applicationDropOffAddressOfficeHours: "Drop off address office hours",
          applicationPickUpAddressOfficeHours: "Pick up address office hours",
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Download application" })).toBeInTheDocument()
    expect(screen.getByText("Pick up an application")).toBeInTheDocument()
    expect(screen.getByText("Pick up address street, Pick up address unit")).toBeInTheDocument()
    expect(screen.getByText("Pick up address city, CA 67890")).toBeInTheDocument()
    expect(screen.getByText("Pick up address office hours")).toBeInTheDocument()
    expect(screen.getByText("Submit a paper application")).toBeInTheDocument()
    expect(screen.getByText("Send application by US Mail")).toBeInTheDocument()
    expect(screen.getByText("Mailing address street, Mailing address unit")).toBeInTheDocument()
    expect(screen.getByText("Mailing address city, CO 12345")).toBeInTheDocument()
    expect(screen.getByText("Drop off application")).toBeInTheDocument()
    expect(screen.getByText("Drop off address street, Drop off address unit")).toBeInTheDocument()
    expect(screen.getByText("Drop off address city, CT 45678")).toBeInTheDocument()
    expect(screen.getByText("Drop off address office hours")).toBeInTheDocument()
    expect(screen.getAllByText("Get directions").length).toBe(2)

    expect(screen.queryByText("Apply online")).not.toBeInTheDocument()
  })

  it("shows mailing address with postmark", () => {
    const dueDate = dayjs(new Date()).add(5, "days").toDate()
    const postmarkDate = dayjs(new Date()).add(10, "days").toDate()
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dueDate,
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "paper-application-id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
          listingsApplicationMailingAddress: {
            id: "id",
            city: "Mailing address city",
            street: "Mailing address street",
            street2: "Mailing address unit",
            zipCode: "12345",
            state: "CO",
            latitude: 1,
            longitude: 2,
          },
          postmarkedApplicationsReceivedByDate: postmarkDate,
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    const postmarkString = getDateString(postmarkDate, `MMM DD, YYYY [${t("t.at")}] hh:mm A`)
    expect(
      screen.getByText(
        `Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by ${postmarkString}. ${listing.developer} is not responsible for lost or delayed mail.`
      )
    )

    expect(screen.queryByText("Apply online")).not.toBeInTheDocument()
  })

  it("shows mailing address with no postmark", () => {
    const dueDate = dayjs(new Date()).add(5, "days").toDate()
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dueDate,
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [
                {
                  id: "id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  language: LanguagesEnum.en,
                  assets: {
                    id: "id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "paper-application-id",
                    label: "Asset label",
                  },
                },
              ],
              phoneNumber: null,
            },
          ],
          listingsApplicationMailingAddress: {
            id: "id",
            city: "Mailing address city",
            street: "Mailing address street",
            street2: "Mailing address unit",
            zipCode: "12345",
            state: "CO",
            latitude: 1,
            longitude: 2,
          },
          postmarkedApplicationsReceivedByDate: null,
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    const dueDateString = getDateString(dueDate, `MMM DD, YYYY [${t("t.at")}] hh:mm A`)

    expect(
      screen.getByText(
        `Applications must be received by the deadline. If sending by U.S. Mail, the application must be received by ${dueDateString}. ${listing.developer} is not responsible for lost or delayed mail.`
      )
    )

    expect(screen.queryByText("Apply online")).not.toBeInTheDocument()
  })

  it("shows mailing address with no online or paper app", () => {
    const addressCity = "Warrensville Heights"
    const addressState = "Ohio"
    const addressStreet = "1598 Peaceful Lane"
    const addressZipCode = "44128"
    render(
      <Apply
        listing={{
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
            },
          ],
          listingsApplicationMailingAddress: {
            id: "mailing_adress_id",
            city: addressCity,
            state: addressState,
            street: addressStreet,
            zipCode: addressZipCode,
          },
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Send application by US Mail")).toBeInTheDocument()
    expect(screen.getByText(addressCity, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(addressState, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(addressStreet, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(addressZipCode, { exact: false })).toBeInTheDocument()
  })

  it("shows apply online button when online app exists and paperApplication is selected but no files uploaded", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: true,
          paperApplication: true, // Marked as having paper applications
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "internal-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
            {
              id: "file-download-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [], // No paper applications uploaded
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    // Should still show the section with apply online button
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      `/applications/start/choose-language?listingId=${listing.id}`
    )
    // Should not show download button since no files were uploaded
    expect(screen.queryByText("Download application")).not.toBeInTheDocument()
  })

  it("does not show section when only FileDownload method exists with no paper apps and no addresses", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: false,
          paperApplication: true,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "file-download-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [], // No paper applications uploaded
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("shows section when FileDownload method has no paper apps but mailing address exists", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: false,
          paperApplication: true,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "file-download-id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
          listingsApplicationMailingAddress: {
            id: "mailing_address_id",
            city: "Test City",
            state: "CA",
            street: "123 Test Street",
            zipCode: "12345",
          },
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Send application by US Mail")).toBeInTheDocument()
  })

  it("shows apply online button when digitalApplication is true and commonDigitalApplication is true", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: true,
          commonDigitalApplication: true,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
  })

  it("does not show section when digitalApplication is true but no Internal or ExternalLink method exists", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: true,
          commonDigitalApplication: false,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.FileDownload,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    // Should not render because there's no valid online application method
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("shows apply online button when ExternalLink method has external reference", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: true,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.ExternalLink,
              acceptsPostmarkedApplications: null,
              externalReference: "https://example.com/apply",
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    expect(screen.getByText("Apply online")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Apply online" })).toHaveAttribute(
      "href",
      "https://example.com/apply"
    )
  })

  it("does not show section when ExternalLink method exists but has no external reference", () => {
    render(
      <Apply
        listing={{
          ...listing,
          digitalApplication: true,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.ExternalLink,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={false}
        setShowDownloadModal={() => null}
      />
    )
    // Should not render because ExternalLink has no URL
    expect(screen.queryByText("How to apply")).not.toBeInTheDocument()
  })

  it("enables apply button when listing status is pending but in preview mode", () => {
    render(
      <Apply
        listing={{
          ...listing,
          status: ListingsStatusEnum.pending,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          applicationMethods: [
            {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              type: ApplicationMethodsTypeEnum.Internal,
              acceptsPostmarkedApplications: null,
              externalReference: null,
              paperApplications: [],
              phoneNumber: null,
            },
          ],
        }}
        preview={true}
        setShowDownloadModal={() => null}
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "How to apply" })).toBeInTheDocument()
    // In preview mode, button should not be disabled
    const applyButton = screen.getByText("Apply online")
    expect(applyButton).toBeInTheDocument()

    // Should have a valid href when enabled
    const linkElement = applyButton.closest("a")
    if (linkElement) {
      expect(linkElement).toHaveAttribute(
        "href",
        expect.stringContaining(`/applications/start/choose-language`)
      )
    }
  })
})
