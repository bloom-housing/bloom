import { Component, useContext } from "react"
import useSWR from "swr"

import Head from "next/head"
import { PageHeader, MetaTags, ApiClientContext, t } from "@bloom-housing/ui-components"
import { Application } from "@bloom-housing/core"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"
import { Listing } from "@bloom-housing/backend-core"

function ListingsData() {
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR("http://localhost:3100", fetcher)
  if (data && data.status == "ok") {
    console.log(`Listings Data Received: ${data.listings.length}`)
  }
  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

function ApplicationsData() {
  const { applicationsService } = useContext(ApiClientContext)
  const fetcher = (url) => applicationsService.list()
  const { data, error } = useSWR("http://localhost:3100/applications", fetcher)
  if (data) {
    console.log(`Applications Data Received: ${data.length}`)
  }
  return {
    applicationDtos: data,
    appsLoading: !error && !data,
    appsError: error,
  }
}

function MergedTableData() {
  const { listingDtos, listingsLoading, listingsError } = ListingsData()
  const { applicationDtos, appsLoading, appsError } = ApplicationsData()
  const applications: Application[] = []
  if (listingDtos && applicationDtos) {
    const listings: Record<string, Listing> = Object.fromEntries(
      listingDtos.listings.map((e) => [e.id, e])
    )
    applicationDtos.forEach((application) => {
      const app: Application = application
      app.listing = listings[application.listing.id]
      applications.push(app)
      console.log(`Assigned ${app.listing.name} to ${application.id}`)
    })
  }
  return {
    applications: applications,
    isLoading: listingsLoading || appsLoading,
    isError: listingsError || appsError,
  }
}

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

  const { applications, isLoading, isError } = MergedTableData()
  if (isError) return "An error has occurred."
  if (isLoading) return "Loading..."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>Applications Received</PageHeader>
      <article className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2">
        <div className="ag-theme-alpine">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={applications}
            domLayout={"autoHeight"}
          ></AgGridReact>
        </div>
      </article>
    </Layout>
  )
}
