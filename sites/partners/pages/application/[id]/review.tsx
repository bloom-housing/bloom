import React, { useMemo, useState, useCallback, useEffect } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { GridApi, RowNode } from "ag-grid-community"

import Layout from "../../../layouts"
import {
  t,
  Button,
  NavigationHeader,
  AlertBox,
  AppearanceStyleType,
  useMutate,
  StatusBar,
  AgTable,
  useAgTable,
  GridSection,
} from "@bloom-housing/ui-components"
import { useSingleFlaggedApplication } from "../../../lib/hooks"
import { getCols } from "./applicationsCols"

import {
  // EnumApplicationFlaggedSetStatus,
  ApplicationFlaggedSet,
} from "@bloom-housing/backend-core/types"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string

  const [gridApi] = useState<GridApi>(null)
  const [selectedRows, setSelectedRows] = useState<RowNode[]>([])

  const columns = useMemo(() => getCols(), [])

  const { data, loading } = useSingleFlaggedApplication(flagsetId)

  const { reset, isSuccess, isError } = useMutate<ApplicationFlaggedSet>()

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

  const tableOptions = useAgTable()

  if (!data) return null

  const getTitle = () => {
    if (data.rule === "Email") {
      return t(`flags.emailRule`, {
        email: data?.applications[0].applicant.emailAddress,
      })
    } else if (data.rule === "Name and DOB") {
      return t("flags.nameDobRule", {
        name: `${data?.applications[0].applicant.firstName} ${data?.applications[0].applicant.lastName}`,
      })
    }
    return ""
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <NavigationHeader
        className="relative"
        title={<p className="font-sans font-semibold text-3xl">{getTitle()}</p>}
      />

      <StatusBar
        backButton={
          <Button inlineIcon="left" icon="arrowBack" onClick={() => router.back()}>
            {t("t.back")}
          </Button>
        }
        tagStyle={AppearanceStyleType.primary}
        tagLabel={t("applications.pendingReview")}
      />

      <section className="bg-primary-lighter py-5">
        <div className="max-w-screen-xl px-5 mx-auto">
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

          <div className="flex md:flex-row flex-col flex-wrap">
            <div className="md:w-9/12 md:pb-24 pb-8">
              {t("flags.selectValidApplications")}
              <AgTable
                id="applications-table"
                className="w-full m-h-0"
                config={{
                  columns,
                  totalItemsLabel: t("applications.totalApplications"),
                  rowSelection: true,
                  setSelectedRows: setSelectedRows,
                }}
                data={{
                  items: data?.applications ?? [],
                  loading,
                  totalItems: data?.applications?.length ?? 0,
                  totalPages: 1,
                }}
                search={{
                  setSearch: tableOptions.filter.setFilterValue,
                  showSearch: false,
                }}
              />
            </div>

            <aside className="md:w-3/12 md:pl-6">
              <GridSection columns={1} className={"w-full"}>
                <Button
                  styleType={
                    selectedRows.length
                      ? AppearanceStyleType.primary
                      : AppearanceStyleType.secondary
                  }
                  onClick={() => alert("save button")}
                  dataTestId={"save-set-button"}
                  disabled={!selectedRows.length}
                >
                  {t("t.save")}
                </Button>
                {data.updatedAt && (
                  <div className="border-t text-sm flex items-center justify-center md:mt-0 mt-4 pt-4">
                    {t("t.lastUpdated")}: {dayjs(data.updatedAt).format("MMMM DD, YYYY")}
                  </div>
                )}
              </GridSection>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Flag
