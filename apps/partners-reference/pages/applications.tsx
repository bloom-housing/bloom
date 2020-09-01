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
      width: 150,
      minWidth: 100,
    },
    {
      headerName: "Last Name",
      field: "application.applicant.lastName",
      sortable: true,
      filter: false,
      pinned: "left",
      autoSizeColumn: true,
      width: 150,
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
      headerName: "Email",
      field: "application.applicant.emailAddress",
      sortable: false,
      filter: false,
      width: 150,
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
          ></AgGridReact>
        </div>
      </article>
    </Layout>
  )
}
