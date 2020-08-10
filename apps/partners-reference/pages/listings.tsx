import { Component, useContext, useState, useEffect } from "react"
import Head from "next/head"
import { PageHeader, MetaTags, ApiClientContext, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"

export default function ListingsList() {
  const { applicationsService } = useContext(ApiClientContext)
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const columnDefs = [
    {
      headerName: "Foo",
      field: "application.foo",
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

  const [listings, setListings] = useState({ applications: [] })

  useEffect(() => {
    const fetchData = async () => {
      const result = await applicationsService.list()
      console.log(result)
      setListings({ applications: result })
    }

    fetchData()
  }, [])

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>List of Applications will go here.</PageHeader>
      <article className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={listings.applications}
          gridAutoHeight={true}
        ></AgGridReact>
      </article>
    </Layout>
  )
}
