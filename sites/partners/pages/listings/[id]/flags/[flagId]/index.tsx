import React, { useMemo, useState, useCallback } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"
import { GridApi, RowNode } from "ag-grid-community"

import Layout from "../../../../../layouts/application"
import {
  t,
  Button,
  PageHeader,
  Tag,
  AppearanceSizeType,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import { useSingleFlaggedApplication } from "../../../../../lib/hooks"
import { getCols } from "../../../../../src/flags/applicationsCols"
import { EnumApplicationFlaggedSetStatus } from "@bloom-housing/backend-core/types"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.flagId as string
  const listingId = router.query.id as string

  const [gridApi, setGridApi] = useState<GridApi>(null)
  const [selectedRows, setSelectedRows] = useState<RowNode[]>([])

  const columns = useMemo(() => getCols(), [])

  const { data } = useSingleFlaggedApplication(flagsetId)

  const onGridReady = (params) => {
    setGridApi(params.api)
  }

  const onSelectionChanged = () => {
    const selected = gridApi.getSelectedNodes()
    setSelectedRows(selected)
  }

  const resolveFlag = useCallback(() => {
    console.log("on resolve click", selectedRows)
  }, [selectedRows])

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
        <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
          <Button
            inlineIcon="left"
            icon="arrowBack"
            onClick={() => router.push(`/listings/${listingId}/flags`)}
          >
            {t("t.back")}
          </Button>

          <div className="status-bar__status md:pl-4 md:w-3/12">
            <Tag
              pillStyle={true}
              size={AppearanceSizeType.normal}
              styleType={
                data.status === EnumApplicationFlaggedSetStatus.resolved
                  ? AppearanceStyleType.success
                  : AppearanceStyleType.info
              }
            >
              {data.status}
            </Tag>
          </div>
        </div>
      </div>

      <section>
        <div className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4 w-full">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                columnDefs={columns}
                rowData={data.applications}
                domLayout="autoHeight"
                headerHeight={83}
                rowHeight={58}
                suppressScrollOnNewData={true}
                rowSelection="multiple"
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
              styleType={AppearanceStyleType.success}
              disabled={selectedRows.length === 0}
            >
              {t("flags.resolveFlag")}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Flag
