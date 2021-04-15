import React, { useMemo, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"

import Layout from "../../../../layouts/application"
import {
  t,
  Button,
  PageHeader,
  Tag,
  AppearanceSizeType,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import { useFlaggedApplicationsList } from "../../../../lib/hooks"
import { getCols } from "../../../../src/flags/applicationsCols"
import { EnumApplicationFlaggedSetStatus } from "@bloom-housing/backend-core/types"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string
  const listingId = router.query.listing as string

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const columns = useMemo(() => getCols(), [])

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  const flagset = useMemo(() => {
    if (!data) return

    return data.items.filter((item) => item.id === flagsetId)?.[0]
  }, [data, flagsetId])

  const onGridReady = (params) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      <PageHeader
        className="relative"
        title={
          <>
            <p className="font-sans font-semibold uppercase text-3xl">Flag Set</p>

            <p className="font-sans text-base mt-1">ID</p>
          </>
        }
      />

      <div className="border-t bg-white">
        <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
          <Button
            inlineIcon="left"
            icon="arrow-back"
            onClick={() => router.push(`/listings/applications?listing=${listingId}`)}
          >
            {t("t.back")}
          </Button>

          <div className="status-bar__status md:pl-4 md:w-3/12">
            <Tag
              pillStyle={true}
              size={AppearanceSizeType.normal}
              styleType={
                flagset?.status === EnumApplicationFlaggedSetStatus.resolved
                  ? AppearanceStyleType.success
                  : AppearanceStyleType.info
              }
            >
              {flagset?.status}
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
                rowData={flagset?.applications}
                domLayout="autoHeight"
                headerHeight={83}
                rowHeight={58}
                suppressScrollOnNewData={true}
                rowSelection={"multiple"}
                onGridReady={onGridReady}
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
                quantity: "TEST",
              })}
            </span>

            <Button
              type="button"
              onClick={() => console.log("resolve")}
              styleType={AppearanceStyleType.success}
              disabled
            >
              {t("flags.resolveFlag")}
            </Button>
          </div>
        </div>

        {console.log(flagset?.applications, gridApi, gridColumnApi)}
      </section>
    </Layout>
  )
}

export default Flag
