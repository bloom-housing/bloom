import React, { useMemo } from "react"
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

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string
  const listingId = router.query.listing as string

  const columns = useMemo(() => getCols(), [])

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  const flagset = useMemo(() => {
    if (!data) return

    return data.items.filter((item) => item.id === flagsetId)?.[0]
  }, [data, flagsetId])

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

      <section className="border-t bg-white">
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
              styleType={AppearanceStyleType.success}
            >
              {flagset?.status}
            </Tag>
          </div>
        </div>
      </section>

      <section className="bg-primary-lighter">
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
                immutableData={true}
                getRowNodeId={(data) => data.row}
              ></AgGridReact>

              <div className="data-pager">
                <div className="data-pager__control-group">
                  <span className="data-pager__control">
                    <span className="field-label" id="lbTotalPages">
                      {data?.items?.length}
                    </span>
                    <span className="field-label">{t("flags.totalSets")}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Flag
