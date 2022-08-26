import React, { useMemo, useState, useCallback, useContext, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"
import { GridApi, RowNode, GridOptions } from "ag-grid-community"

import Layout from "../../../layouts"
import {
  t,
  Button,
  NavigationHeader,
  AlertBox,
  AppearanceStyleType,
  useMutate,
  StatusBar,
  StatusAside,
  GridCell,
  AgTable,
  useAgTable,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useSingleFlaggedApplication } from "../../../lib/hooks"
import { getCols } from "../../../src/flags/applicationsCols"

import {
  EnumApplicationFlaggedSetStatus,
  ApplicationFlaggedSet,
} from "@bloom-housing/backend-core/types"

const Flag = () => {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const router = useRouter()
  console.log("34:", router.query)
  const flagsetId = router.query.id as string
  const listingId = ""

  const [gridApi, setGridApi] = useState<GridApi>(null)
  const [selectedRows, setSelectedRows] = useState<RowNode[]>([])

  const columns = useMemo(() => getCols(), [])

  const { data, revalidate } = useSingleFlaggedApplication(flagsetId)

  const { mutate, reset, isSuccess, isLoading, isError } = useMutate<ApplicationFlaggedSet>()

  const gridOptions: GridOptions = {
    getRowNodeId: (data) => data.id,
  }

  /* It selects all flagged rows on init and update (revalidate). */
  const selectFlaggedApps = useCallback(() => {
    if (!data) return

    const duplicateIds = data.applications
      .filter((item) => item.markedAsDuplicate)
      .map((item) => item.id)

    gridApi.forEachNode((row) => {
      if (duplicateIds.includes(row.id)) {
        gridApi.selectNode(row, true)
      }
    })
  }, [data, gridApi])

  useEffect(() => {
    if (!gridApi) return

    selectFlaggedApps()
  }, [data, gridApi, selectFlaggedApps])

  const onGridReady = (params) => {
    setGridApi(params.api)
  }

  const onSelectionChanged = () => {
    const selected = gridApi.getSelectedNodes()
    setSelectedRows(selected)
  }

  const deselectAll = useCallback(() => {
    gridApi.deselectAll()
  }, [gridApi])

  const resolveFlag = useCallback(() => {
    const applicationIds = selectedRows?.map((item) => ({ id: item.data.id })) || []

    void reset()

    void mutate(() =>
      applicationFlaggedSetsService.resolve({
        body: {
          afsId: flagsetId,
          applications: applicationIds,
        },
      })
    ).then(() => {
      deselectAll()
      void revalidate()
    })
  }, [
    mutate,
    reset,
    revalidate,
    deselectAll,
    selectedRows,
    applicationFlaggedSetsService,
    flagsetId,
  ])

  const tableOptions = useAgTable()

  const actions = [
    <GridCell key="btn-submitNew">
      <Button
        type="button"
        onClick={resolveFlag}
        styleType={
          data?.status === EnumApplicationFlaggedSetStatus.resolved
            ? AppearanceStyleType.secondary
            : AppearanceStyleType.success
        }
        disabled={
          selectedRows.length === 0 && data?.status !== EnumApplicationFlaggedSetStatus.resolved
        }
        loading={isLoading}
      >
        {data?.status === EnumApplicationFlaggedSetStatus.resolved
          ? t("account.settings.update")
          : t("flags.resolveFlag")}
      </Button>
    </GridCell>,
  ]

  if (!data) return null
  console.log("108:", data)
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <NavigationHeader
        className="relative"
        title={
          <>
            <p className="font-sans font-semibold uppercase text-3xl">{data.rule}</p>
          </>
        }
      />

      <div className="border-t bg-white">
        <StatusBar
          backButton={
            <Button
              inlineIcon="left"
              icon="arrowBack"
              onClick={() => router.push(`/listings/${listingId}/flags`)}
            >
              {t("t.back")}
            </Button>
          }
          tagStyle={AppearanceStyleType.primary}
          tagLabel={data.status === "flagged" ? t("applications.pendingReview") : data.status}
        />
      </div>

      <section>
        <div className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4 w-full">
          {(isSuccess || isError) && (
            <AlertBox
              className="mb-5"
              type={isSuccess ? "success" : "alert"}
              closeable
              onClose={() => reset()}
            >
              {isSuccess ? "Updated" : t("account.settings.alerts.genericError")}
            </AlertBox>
          )}
          <div className="ag-theme-alpine ag-theme-bloom">
            <StatusAside columns={1} actions={actions} />
            <div className="applications-table mt-5">
              <AgGridReact
                columnDefs={columns}
                rowData={data.applications}
                gridOptions={gridOptions}
                domLayout="autoHeight"
                headerHeight={83}
                rowHeight={58}
                suppressScrollOnNewData={true}
                rowSelection="multiple"
                rowMultiSelectWithClick={true}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
              ></AgGridReact>

              <p> agTable below </p>
              <AgTable
                id="listings-table"
                pagination={{
                  perPage: tableOptions.pagination.itemsPerPage,
                  setPerPage: tableOptions.pagination.setItemsPerPage,
                  currentPage: tableOptions.pagination.currentPage,
                  setCurrentPage: tableOptions.pagination.setCurrentPage,
                }}
                config={{
                  columns,
                  totalItemsLabel: t("listings.totalListings"),
                  rowSelection: true,
                }}
                data={{
                  items: data?.applications ?? [],
                  loading: false,
                  totalItems: data?.applications?.length ?? 0,
                  totalPages: 1,
                }}
                search={{
                  setSearch: tableOptions.filter.setFilterValue,
                }}
                sort={{
                  setSort: tableOptions.sort.setSortOptions,
                }}
                headerContent={
                  <div className="flex-row">
                    <Button className="mx-1" onClick={() => console.log("hello")}>
                      {t("listings.addListing")}
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Flag
