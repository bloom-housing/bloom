import React, { useMemo, useContext } from "react"
import Head from "next/head"
import {
  PageHeader,
  t,
  lRoute,
  AuthContext,
  Button,
  LocalizedLink,
} from "@bloom-housing/ui-components"
import moment from "moment"
import { UserRole, Listing } from "@bloom-housing/backend-core/types"
import { AgGridReact } from "ag-grid-react"
import { GridOptions } from "ag-grid-community"

import { useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"
import { Router, useRouter } from "next/router"

export default function ListingsList() {
  const { profile } = useContext(AuthContext)
  const leasingAgentInListings = profile.leasingAgentInListings?.map((item) => item.id)
  const router = useRouter()
  class formatLinkCell {
    link: HTMLAnchorElement

    init(params) {
      this.link = document.createElement("a")
      this.link.classList.add("text-blue-700")
      this.link.setAttribute("href", lRoute(`/listings/${params.data.id}/edit`))
      this.link.innerText = params.valueFormatted || params.value
    }

    getGui() {
      return this.link
    }
  }

  class ApplicationsLink extends formatLinkCell {
    init(params) {
      super.init(params)
      this.link.setAttribute("href", lRoute(`/listings/${params.data.id}/applications`))
    }
  }

  class ListingsLink extends formatLinkCell {
    init(params) {
      super.init(params)
      this.link.setAttribute("href", lRoute(`/listings/${params.data.id}`))
    }
  }

  class formatWaitlistStatus {
    text: HTMLSpanElement

    init({ data }) {
      const isWaitlistOpen = data.waitlistCurrentSize < data.waitlistMaxSize

      this.text = document.createElement("span")
      this.text.innerHTML = isWaitlistOpen ? t("t.yes") : t("t.no")
    }

    getGui() {
      return this.text
    }
  }

  const gridOptions: GridOptions = {
    components: {
      ApplicationsLink,
      formatLinkCell,
      formatWaitlistStatus,
      ListingsLink,
    },
  }

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const columnDefs = useMemo(() => {
    const columns = [
      {
        headerName: t("name"),
        field: "name",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "ApplicationsLink",
      },
      {
        headerName: t("listings.property.buildingAddress"),
        field: "property.buildingAddress.street",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => moment(value).format("MM/DD/YYYY"),
      },
      {
        headerName: t("listings.availableUnits"),
        field: "unitsAvailable",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("listings.waitlist.open"),
        field: "waitlistCurrentSize",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatWaitlistStatus",
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`listings.${value}`),
      },
    ]
    if (process.env.showLMLinks) {
      columns.unshift({
        headerName: t("listings.listingName"),
        field: "name",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "ListingsLink",
      })
    }
    return columns
  }, [])

  const { listingDtos, listingsLoading, listingsError } = useListingsData()

  // filter listings to show items depends on user role
  const filteredListings = useMemo(() => {
    if (profile.roles.includes(UserRole.admin)) return listingDtos

    return listingDtos?.reduce((acc, curr) => {
      if (leasingAgentInListings.includes(curr.id)) {
        acc.push(curr)
      }

      return acc
    }, []) as Listing[]
  }, [leasingAgentInListings, listingDtos, profile.roles])

  if (listingsLoading) return "Loading..."
  if (listingsError) return "An error has occurred."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags
        title={t("nav.siteTitlePartners")}
        image={metaImage}
        description={metaDescription}
      />
      <PageHeader title={t("nav.listings")} />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56"></div>
              <div className="flex-row">
                {profile.roles.includes(UserRole.admin) && process.env.showLMLinks && (
                  <Button className="mx-1" onClick={() => void router.push("/listings/add")}>
                    {t("listings.addListing")}
                  </Button>
                )}
              </div>
            </div>
            <div className="applications-table mt-5">
              <AgGridReact
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                rowData={filteredListings}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <div className="data-pager">
                <div className="data-pager__control-group">
                  <span className="data-pager__control">
                    <span className="field-label" id="lbTotalPages">
                      {filteredListings?.length}
                    </span>
                    <span className="field-label">{t("listings.totalListings")}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}
