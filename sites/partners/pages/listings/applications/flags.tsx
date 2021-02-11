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
  const afs = appsData?.items || []

  const pendingReviews = useMemo(() => {
    let count = 0
    appsData?.items.forEach((item) => {
      count = item.applications.length
    })
    return count
  }, [appsData])

  const primaryApplicant = useMemo(() => {
    let fullName
    appsData?.items.forEach((item) => {
      item.applications.forEach((app) => {
        fullName = app.applicant.firstName + " " + app.applicant.lastName
      })
    })
    return fullName
  }, [appsData])

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
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
        field: `${primaryApplicant}`,
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: `${primaryApplicant}`,
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
      },
    ],
    []
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
