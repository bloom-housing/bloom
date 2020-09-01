import React from "react"

import Head from "next/head"
import { PageHeader, MetaTags, t } from "@bloom-housing/ui-components"
import { useApplicationsData } from "../lib/hooks"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"

export default function ApplicationsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  const columnDefs = [
    {
      headerName: "Application Submission Date",
      field: "createdAt",
      sortable: true,
      filter: false,
      pinned: "left",
      autoSizeColumn: true,
      width: 200,
      minWidth: 150,
      sort: "asc",
    },
    {
      headerName: "First Name",
      field: "application.applicant.firstName",
      sortable: true,
      filter: false,
      pinned: "left",
      autoSizeColumn: true,
      width: 125,
      minWidth: 100,
    },
    {
      headerName: "Last Name",
      field: "application.applicant.lastName",
      sortable: true,
      filter: false,
      pinned: "left",
      autoSizeColumn: true,
      width: 125,
      minWidth: 100,
    },
    {
      headerName: "Application Number",
      field: "id",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
      type: 'rightAligned',
    },
    {
      headerName: "Household Size",
      field: "application.householdSize",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
      type: 'rightAligned',
    },
    {
      headerName: "Declared Annual Income",
      field: "application.income",
      sortable: false,
      filter: false,
      width: 200,
      minWidth: 150,
      type: 'rightAligned',
    },
    {
      headerName: "Requested ADA",
      field: "application.incomeVouchers",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: "Preference Claimed",
      field: "application.preferences.youHaveClaimed",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: "Primary DOB",
      field: "application.household.member.dateOfBirth",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: "Email",
      field: "application.applicant.emailAddress",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: "Phone",
      field: "application.applicant.phoneNumber",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: "Residence Address",
      field: "application.applicant.address.street",
      sortable: false,
      filter: false,
      width: 175,
      minWidth: 150,
    },
    {
      headerName: "Residence City",
      field: "application.applicant.address.city",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
    },
    {
      headerName: "Residence State",
      field: "application.applicant.address.state",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: "Residence Zip",
      field: "application.applicant.address.zipCode",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: "Listing",
      field: "listing.name",
      sortable: false,
      filter: false,
    },
  ]

  const { applicationDtos, appsLoading, appsError } = useApplicationsData()
  if (appsError) return "An error has occurred."
  if (appsLoading) return "Loading..."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>Applications Received</PageHeader>
      <article className="flex-row flex-wrap max-w-screen-xl mx-auto py-8 px-4 border-b-2">
        <div className="ag-theme-alpine ag-theme-bloom">
          <AgGridReact
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowData={applicationDtos}
            domLayout={"autoHeight"}
            headerHeight={83}
            rowHeight={58}
            suppressPaginationPanel={true}
            paginationPageSize={8}
            suppressScrollOnNewData={true}
          ></AgGridReact>

          <div className="data-pager">
            <button className="button data-pager__previous data-pager__control" onClick={() => this.onBtPrevious()}>Previous</button>
            
            <div className="data-pager__control-group">
            <span className="data-pager__control">
              <span className="field-label" id="lbTotalPages">12</span>
              <span className="field-label">Total Applications</span>
            </span>

            <span className="field data-pager__control">
              <label className="field-label" htmlFor="page-size">Show</label>
              <select onChange={() => this.onPageSizeChanged()} id="page-size">
                <option value="10" selected>8</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
            </span>

            <span className="field data-pager__control">
              <label className="field-label" htmlFor="page-jump">Jump to</label>
              <select onChange={() => this.onPageSizeChanged()} id="page-jump">
                <option value="2" selected>2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </span>
            </div>

            <button className="button data-pager__next data-pager__control" onClick={() => this.onBtNext()}>Next</button>
          </div>
        </div>
      </article>
    </Layout>
  )
}
