import { t } from "@bloom-housing/ui-components"
import { ColumnApi } from "ag-grid-community"
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
  console.log("NETRA appsData", appsData)

  const columnDefs = useMemo(
    () => [
      {
        headerName: t("flaggedSet.flaggedSet"),
        field: "flaggedSet",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatLinkCell",
      },
      {
        headerName: t("application.household.primaryApplicant"),
        field: "primaryApplicant",
        sortable: false,
        filter: false,
        resizable: true,
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
        field: "pendingReview",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatWaitlistStatus",
      },
      {
        headerName: t("application.status"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`listings.${value}`),
      },
    ],
    []
  )

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }
  // reset page to 1 when user change limit
  useEffect(() => {
    setPageIndex(1)
  }, [pageSize])
  
  const applications = appsData?.items || []

  return (
    <Layout>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={applications}
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