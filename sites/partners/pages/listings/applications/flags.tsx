import { t, lRoute } from "@bloom-housing/ui-components"
import { ColumnApi, GridOptions } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import Layout from "../../../layouts/application"
import { useApplicationFlaggedSetData } from "../../../lib/hooks"

const ApplicationFlaggedSetList = () => {
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const { register, watch } = useForm()
  const router = useRouter()
  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)

  const listingId = router.query.listing as string
  const { appsData } = useApplicationFlaggedSetData(pageIndex, pageSize, listingId)
  const afs = appsData?.items || []

  const pendingReviews = useMemo(() => {
    let count = 0
    appsData?.items.forEach((item) => {
      count = item.applications.length
    })
    return count
  }, [appsData])

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  class formatLinkCell {
    link: HTMLAnchorElement

    init(params) {
      this.link = document.createElement("a")
      this.link.classList.add("text-blue-700")
      this.link.setAttribute(
        "href",
        lRoute(`/listings/applications/flags/details?id=${params?.data?.id}`)
      )
      this.link.innerText = params.value
    }

    getGui() {
      return this.link
    }
  }

  const gridOptions: GridOptions = {
    components: {
      formatLinkCell: formatLinkCell,
    },
  }

  const columnDefs = useMemo(
    () => [
      {
        headerName: t("flaggedSet.flaggedSet"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("application.household.primaryApplicant"),
        field: "applications",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => {
          if (!value?.length) return

          const { firstName, lastName } = value[0]?.applicant
          return `${firstName} ${lastName}`
        },
      },
      {
        headerName: t("flaggedSet.ruleName"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("flaggedSet.pendingReview"),
        field: `${pendingReviews}`,
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: `${pendingReviews}`,
      },
      {
        headerName: t("application.status"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`flaggedSet.${value}`),
        cellRenderer: "formatLinkCell",
      },
    ],
    [pendingReviews]
  )

  // reset page to 1 when user change limit
  useEffect(() => {
    setPageIndex(1)
  }, [pageSize])

  return (
    <Layout>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={afs}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={8}
                suppressScrollOnNewData={true}
              ></AgGridReact>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationFlaggedSetList
