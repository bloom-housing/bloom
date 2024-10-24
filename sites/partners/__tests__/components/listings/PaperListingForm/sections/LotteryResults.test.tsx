import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { rest } from "msw"
import { setupServer } from "msw/node"
import LotteryResults from "../../../../../src/components/listings/PaperListingForm/sections/LotteryResults"
import { FormProvider, useForm } from "react-hook-form"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import {
  ListingEvent,
  ListingEventsTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("LotteryResults", () => {
  it("Should not render anything when drawerState is false", () => {
    const submitFn = jest.fn()
    const showDrawerFn = jest.fn()
    const results = render(
      <FormComponent>
        <LotteryResults submitCallback={submitFn} drawerState={false} showDrawer={showDrawerFn} />
      </FormComponent>
    )

    expect(results.container.innerHTML).toEqual("")
  })

  it("Should Render Lottery Results in open state", () => {
    const submitFn = jest.fn()
    const showDrawerFn = jest.fn()
    const results = render(
      <FormComponent>
        <LotteryResults submitCallback={submitFn} drawerState={true} showDrawer={showDrawerFn} />
      </FormComponent>
    )

    expect(results.getByText("Add Results")).toBeTruthy()
    expect(results.getByText("Upload Results")).toBeTruthy()
    expect(results.getByText("Select PDF file")).toBeTruthy()
    expect(results.getByText("Drag files here", { exact: false })).toBeTruthy()
    expect(results.getByText("choose from folder")).toBeTruthy()
    expect(results.getByText("Save")).toBeTruthy()
    expect(results.getByText("Cancel")).toBeTruthy()
  })

  it("Should call showDrawer function when cancel is clicked", () => {
    const submitFn = jest.fn()
    const showDrawerFn = jest.fn()
    const results = render(
      <FormComponent>
        <LotteryResults submitCallback={submitFn} drawerState={true} showDrawer={showDrawerFn} />
      </FormComponent>
    )

    expect(results.getByText("Add Results")).toBeTruthy()

    fireEvent.click(results.getByText("Cancel"))

    expect(showDrawerFn).toBeCalledWith(false)
  })

  it("Should show Edit result when one exists on load", () => {
    const lotteryResultEvent: ListingEvent = {
      type: ListingEventsTypeEnum.lotteryResults,
      id: "lotteryId",
      assets: {
        id: "id",
        createdAt: new Date(),
        updatedAt: new Date(),
        fileId: "https://lottery.com/results.pdf",
        label: "cloudinaryPDF",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const submitFn = jest.fn()
    const showDrawerFn = jest.fn()
    const results = render(
      <FormComponent values={{ ...formDefaults, listingEvents: [lotteryResultEvent] }}>
        <LotteryResults submitCallback={submitFn} drawerState={true} showDrawer={showDrawerFn} />
      </FormComponent>
    )

    expect(results.getByText("Edit Results")).toBeTruthy()
    expect(results.getByText("Preview")).toBeTruthy()
    expect(results.getByText("lotteryId")).toBeTruthy()
    expect(results.getByText("Post")).toBeTruthy()
    expect(results.queryByText("Save")).toBeFalsy()
  })

  // This test needs to be skipped until this is fixed in MSW https://github.com/mswjs/interceptors/issues/187
  // or we move off of axios onto a fetch based api
  it.skip("Should upload pdf when file dropped in", async () => {
    server.use(
      rest.post("https://api.cloudinary.com/v1_1/exygy/upload", (_req, res, ctx) => {
        return res(
          ctx.json({ public_id: "dev/Untitled_document_ltgz0q", url: "http://example.com" })
        )
      }),
      rest.post("http://localhost:3100/assets/presigned-upload-metadata", (_req, res, ctx) => {
        return res(ctx.status(201), ctx.json(""))
      })
    )

    const submitFn = jest.fn()
    const showDrawerFn = jest.fn()
    const results = render(
      <FormComponent>
        <LotteryResults submitCallback={submitFn} drawerState={true} showDrawer={showDrawerFn} />
      </FormComponent>
    )

    expect(results.getByText("Add Results")).toBeTruthy()
    expect(results.getByText("Drag files here", { exact: false })).toBeTruthy()
    const file = new File(["hello"], "sample.pdf", { type: "application/pdf" })
    await userEvent.upload(results.getByTestId("dropzone-input"), file)

    await results.findByAltText("PDF preview")
    expect(results.getByText("Untitled_document_ltgz0q")).toBeInTheDocument()
    expect(results.getByText("Delete")).toBeInTheDocument()
  })
})
