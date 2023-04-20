// import {
//   ACCESS_TOKEN_LOCAL_STORAGE_KEY,
//   AuthProvider,
//   ConfigProvider,
// } from "@bloom-housing/shared-helpers"

import { fireEvent, render } from "@testing-library/react"
// import { rest } from "msw"
// import { setupServer } from "msw/node"
// import ListingsList from "../../../src/pages/index"
// import React from "react"
// import { listing } from "../../testHelpers"

// //Mock the jszip package used for Export
// const mockFile = jest.fn()
// let mockFolder: jest.Mock
// function mockJszip() {
//   mockFolder = jest.fn(mockJszip)
//   return {
//     folder: mockFolder,
//     file: mockFile,
//     generateAsync: jest.fn().mockImplementation(() => {
//       const blob = {}
//       const response = { blob }
//       return Promise.resolve(response)
//     }),
//   }
// }
// jest.mock("jszip", () => {
//   return {
//     __esModule: true,
//     default: mockJszip,
//   }
// })

// const server = setupServer()
// beforeAll(() => {
//   server.listen()
// })

// afterEach(() => {
//   server.resetHandlers()
//   window.sessionStorage.clear()
// })

// afterAll(() => server.close())

// describe("listings", () => {
//   it("should not render Export to CSV when user is not admin", async () => {
//     jest.useFakeTimers()
//     const fakeToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
//     window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
//     server.use(
//       rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
//         return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
//       }),
//       rest.get("http://localhost:3100/user", (_req, res, ctx) => {
//         return res(
//           ctx.json({ id: "user1", roles: { id: "user1", isAdmin: false, isPartner: true } })
//         )
//       })
//     )

//     const { findByText, queryByText } = render(
//       <ConfigProvider apiUrl={"http://localhost:3100"}>
//         <AuthProvider>
//           <ListingsList />
//         </AuthProvider>
//       </ConfigProvider>
//     )
//     const header = await findByText("Detroit Partner Portal")
//     expect(header).toBeInTheDocument()
//     const exportButton = queryByText("Export to CSV")
//     expect(exportButton).not.toBeInTheDocument()
//   })

//   it("should render the error text when listings csv api call fails", async () => {
//     jest.useFakeTimers()
//     const fakeToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
//     window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
//     server.use(
//       rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
//         return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
//       }),
//       rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
//         return res(ctx.status(500), ctx.json(""))
//       }),
//       rest.get("http://localhost:3100/user", (_req, res, ctx) => {
//         return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
//       })
//     )

//     const { findByText, getByText } = render(
//       <ConfigProvider apiUrl={"http://localhost:3100"}>
//         <AuthProvider>
//           <ListingsList />
//         </AuthProvider>
//       </ConfigProvider>
//     )
//     const header = await findByText("Detroit Partner Portal")
//     expect(header).toBeInTheDocument()
//     const exportButton = getByText("Export to CSV")
//     expect(exportButton).toBeInTheDocument()
//     fireEvent.click(exportButton)
//     jest.clearAllTimers()
//     const error = await findByText(
//       "Export failed. Please try again later. If the problem persists, please email supportbloom@exygy.com",
//       {
//         exact: false,
//       }
//     )
//     expect(error).toBeInTheDocument()
//   })

//   it("should render Export to CSV when user is admin and success message when clicked", async () => {
//     window.URL.createObjectURL = jest.fn()
//     //Prevent error from clicking anchor tag within test
//     HTMLAnchorElement.prototype.click = jest.fn()
//     jest.useFakeTimers()
//     const fakeToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
//     window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
//     server.use(
//       rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
//         return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
//       }),

//       rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
//         return res(ctx.json({ listingCSV: "", unitCSV: "" }))
//       }),
//       rest.get("http://localhost:3100/user", (_req, res, ctx) => {
//         return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
//       })
//     )

//     const { findByText, getByText } = render(
//       <ConfigProvider apiUrl={"http://localhost:3100"}>
//         <AuthProvider>
//           <ListingsList />
//         </AuthProvider>
//       </ConfigProvider>
//     )
//     const header = await findByText("Detroit Partner Portal")
//     expect(header).toBeInTheDocument()
//     const exportButton = getByText("Export to CSV")
//     expect(exportButton).toBeInTheDocument()
//     fireEvent.click(exportButton)
//     jest.clearAllTimers()
//     const success = await findByText("The file has been exported")
//     expect(success).toBeInTheDocument()
//   })
// })
