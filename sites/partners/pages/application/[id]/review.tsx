import React, { useMemo, useState, useCallback, useEffect, useContext } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"
import { GridApi, RowNode, GridOptions, Grid } from "ag-grid-community"
import { useForm, useWatch, useFormContext } from "react-hook-form"
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
  Modal,
  AppearanceBorderType,
  Field,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useSingleFlaggedApplication } from "../../../lib/hooks"
import Layout from "../../../layouts"
import { getCols } from "./applicationsCols"
import {
  ApplicationFlaggedSet,
  ApplicationReviewStatus,
  EnumApplicationFlaggedSetResolveReviewStatus,
  EnumApplicationFlaggedSetStatus,
} from "@bloom-housing/backend-core/types"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<RowNode[]>([])
  const [gridApi, setGridApi] = useState<GridApi | null>(null)

  const columns = useMemo(() => getCols(), [])

  const { data, loading, revalidate } = useSingleFlaggedApplication(flagsetId)
  const { mutate, reset, isSuccess, isLoading, isError } = useMutate<ApplicationFlaggedSet>()
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, trigger, getValues, setValue, control } = useForm()

  const gridOptions: GridOptions = {
    getRowNodeId: (data) => data.id,
  }

  /* It selects all flagged rows on init and update (revalidate). */
  const selectFlaggedApps = useCallback(() => {
    if (!data) return

    gridApi.forEachNode((row) => {
      if (
        row.data.reviewStatus === EnumApplicationFlaggedSetResolveReviewStatus.pendingAndValid ||
        row.data.reviewStatus === EnumApplicationFlaggedSetResolveReviewStatus.valid
      ) {
        row.setSelected(true)
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

  const numberConfirmedApps = data.applications.filter((app) => !app.markedAsDuplicate).length

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
        tagStyle={
          data.status === EnumApplicationFlaggedSetStatus.resolved
            ? AppearanceStyleType.success
            : AppearanceStyleType.primary
        }
        tagLabel={
          data.status === EnumApplicationFlaggedSetStatus.resolved
            ? t("t.resolved")
            : t("applications.pendingReview")
        }
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
              {isSuccess ? t("t.updated") : t("account.settings.alerts.genericError")}
            </AlertBox>
          )}
          {data.showConfirmationAlert && (
            <AlertBox
              className="md:w-9/12 mb-5"
              type={"success"}
              closeable
              onClose={() => {
                // todo: call backend, update this flag, endpoint does not yet exist
              }}
            >
              {numberConfirmedApps > 1
                ? t("flags.confirmationAlertPlural", { amount: numberConfirmedApps })
                : t("flags.confirmationAlertSingular", { amount: numberConfirmedApps })}
            </AlertBox>
          )}

          <div className="flex md:flex-row flex-col flex-wrap">
            <div className="md:w-9/12 md:pb-24 pb-8">
              <p className={"font-semibold"}>{t("flags.selectValidApplications")}</p>
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
                  loading: isLoading,
                  totalItems: data?.applications?.length ?? 0,
                  totalPages: 1,
                }}
                search={{
                  setSearch: tableOptions.filter.setFilterValue,
                  showSearch: false,
                }}
                gridApi={gridApi}
                setGridApi={setGridApi}
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
                  onClick={() => setSaveModalOpen(true)}
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
      <Modal
        open={!!saveModalOpen}
        title={t("flags.updateStatus")}
        ariaDescription={t("listings.closeThisListing")}
        onClose={() => setSaveModalOpen(false)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.primary}
            onClick={async () => {
              const selectedData = gridApi.getSelectedRows()
              try {
                await applicationFlaggedSetsService.resolve({
                  body: {
                    afsId: data.id,
                    applications: selectedData.map((row) => {
                      return { id: row.id }
                    }),
                    reviewStatus: EnumApplicationFlaggedSetResolveReviewStatus.pendingAndValid,
                  },
                })
                // TODO: set success alert
              } catch (err) {
                // TODO: set failure alert
                console.warn(err)
              }
              setSaveModalOpen(false)
            }}
          >
            {t("t.save")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setSaveModalOpen(false)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        <Field
          id="setStatus.pending"
          name="setStatus"
          className="m-0"
          type="radio"
          label={t("applications.pendingReview")}
          register={register}
          inputProps={{
            value: "pending",
            defaultChecked: true, // todo: what is the flag for seeing if it is resolved?
          }}
        />
        <p className={"mb-6 ml-8 text-sm text-gray-800"}>{t("flags.pendingDescription")}</p>

        <Field
          id="setStatus.resolved"
          name="setStatus"
          className="m-0 border-t pt-6"
          type="radio"
          label={t("t.resolved")}
          register={register}
          inputProps={{
            value: "resolved",
            defaultChecked: false, // todo: what is the flag for seeing if it is resolved?
          }}
        />
        <p className={"ml-8 text-sm text-gray-800"}>{t("flags.resolvedDescription")}</p>
      </Modal>
    </Layout>
  )
}

export default Flag
