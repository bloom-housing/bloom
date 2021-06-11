import React, { useMemo, useState, useCallback, useContext, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"
import { GridApi, RowNode, GridOptions } from "ag-grid-community"

import Layout from "../../../../../layouts/"
import {
  t,
  Button,
  PageHeader,
  AlertBox,
  AppearanceStyleType,
  useMutate,
  ApiClientContext,
  StatusBar,
} from "@bloom-housing/ui-components"
import { useSingleFlaggedApplication } from "../../../../../lib/hooks"
import { getCols } from "../../../../../src/flags/applicationsCols"
import {
  EnumApplicationFlaggedSetStatus,
  ApplicationFlaggedSet,
} from "@bloom-housing/backend-core/types"

const Flag = () => {
  const { applicationFlaggedSetsService } = useContext(ApiClientContext)

  const router = useRouter()
  const flagsetId = router.query.flagId as string
  const listingId = router.query.id as string

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

  if (!data) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      <PageHeader
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
          tagStyle={
            data.status === EnumApplicationFlaggedSetStatus.resolved
              ? AppearanceStyleType.success
              : AppearanceStyleType.info
          }
          tagLabel={data.status}
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

              <div className="data-pager">
                <div className="data-pager__control-group">
                  <span className="data-pager__control"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center mt-5">
            <span className="font-sans text-sm font-semibold">
              {t("flags.markedAsDuplicate", {
                quantity: selectedRows.length,
              })}
            </span>

            <Button
              type="button"
              onClick={resolveFlag}
              styleType={
                data.status === EnumApplicationFlaggedSetStatus.resolved
                  ? AppearanceStyleType.secondary
                  : AppearanceStyleType.success
              }
              disabled={
                selectedRows.length === 0 &&
                data.status !== EnumApplicationFlaggedSetStatus.resolved
              }
              loading={isLoading}
            >
              {data.status === EnumApplicationFlaggedSetStatus.resolved
                ? t("account.settings.update")
                : t("flags.resolveFlag")}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Flag
