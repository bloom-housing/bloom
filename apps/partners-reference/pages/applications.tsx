import React from "react"

import Head from "next/head"
import { PageHeader, MetaTags, t } from "@bloom-housing/ui-components"
import { useApplicationsData } from "../lib/hooks"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"

export default function ApplicationsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const columnDefs = [
    {
      headerName: "Listing",
      field: "listing.name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "First Name",
      field: "application.applicant.firstName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Last Name",
      field: "application.applicant.lastName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "application.applicant.emailAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Id",
      field: "id",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created",
      field: "createdAt",
      sortable: true,
      filter: true,
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
      <article className="flex-row flex-wrap max-w-5xl mx-auto py-8 border-b-2">
        <div className="ag-theme-alpine">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={applicationDtos}
            domLayout={"autoHeight"}
          ></AgGridReact>
        </div>
      </article>
    </Layout>
  )
}
