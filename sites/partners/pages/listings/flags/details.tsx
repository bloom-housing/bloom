import { Application, ApplicationFlaggedSet } from "@bloom-housing/backend-core/types"
import {
  AppearanceStyleType,
  Button,
  PageHeader,
  StatusBar,
  t,
  Tag,
} from "@bloom-housing/ui-components"
import { ColumnApi, GridOptions } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import Layout from "../../../layouts/application"
import { useApplicationFlaggedSetData, useUnresolvedAFSData } from "../../../lib/hooks"

const ApplicationFlaggedSetDetails = () => {
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const router = useRouter()
  const { watch } = useForm()
  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)
  const COLUMN_STATE_KEY = "column-state"

  const listingId = router.query.listing as string
  const afsId = router.query.id as string

  const { appsData } = useApplicationFlaggedSetData(pageIndex, pageSize, listingId)
  const { appsDataUnresolved } = useUnresolvedAFSData(afsId)
  const afs = appsData?.items || []

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }
  const gridOptions: GridOptions = {
    onSortChanged: (params) => saveColumnState(params.columnApi),
    onColumnMoved: (params) => saveColumnState(params.columnApi),
  }
  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
    this.api.sizeColumnsToFit()
  }
  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }
  const columnDefs = useMemo(
    () => [
      {
        headerName: t("application.details.number"),
        field: "id",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("application.name.firstName"),
        field: "applicant",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => {
          if (!value?.length) return

          const { firstName } = value[0]?.applicant
          return `${firstName}`
        },
      },
      {
        headerName: t("application.name.lastName"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("applications.table.primaryDob"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("t.email"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
      },
      {
        headerName: t("t.phone"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
      },
      {
        headerName: t("applications.table.applicationSubmissionDate"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
      },
    ],
    []
  )
  return (
    <Layout>
      <section>
        <Head>
          <title>NAME AND DOB</title>
        </Head>
        <PageHeader
          title={
            <>
              <p className="font-sans font-semibold uppercase text-3xl">
                NAME 
              </p>
            </>
          }>NAME AND DOB</PageHeader>
        <StatusBar
          backButton={
            <Button inlineIcon="left" icon="arrow-back" onClick={() => router.back()}>
              {t("t.back")}
            </Button>
          }
          tagStyle={AppearanceStyleType.flagged}
          tagLabel="FLAGGED"
        />
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                onGridReady={onGridReady}
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

        <Button className="mx-1" onClick={() => false}>
          {t("applications.addApplication")}
        </Button>

        <Tag styleType={AppearanceStyleType.success}>Resolve Flag</Tag>
      </section>
    </Layout>
  )
}

export default ApplicationFlaggedSetDetails
