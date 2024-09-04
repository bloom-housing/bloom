import React, { useMemo, useState, useContext } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useSWRConfig } from "swr"
import { useRouter } from "next/router"
import { GridApi } from "ag-grid-community"
import { useForm } from "react-hook-form"
import { t, AlertBox, useMutate, AgTable, useAgTable, Field } from "@bloom-housing/ui-components"
import { Button, Dialog, Icon, Tag } from "@bloom-housing/ui-seeds"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import {
  AfsResolve,
  ApplicationFlaggedSet,
  ApplicationReviewStatusEnum,
  FlaggedSetStatusEnum,
  RuleEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useSingleFlaggedApplication } from "../../../lib/hooks"
import Layout from "../../../layouts"
import { getCols } from "./applicationsCols"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { StatusBar } from "../../../components/shared/StatusBar"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [gridApi, setGridApi] = useState<GridApi | null>(null)

  const columns = useMemo(() => getCols(), [])

  const { data, cacheKey } = useSingleFlaggedApplication(flagsetId)
  const { reset, isSuccess, isLoading, isError } = useMutate<ApplicationFlaggedSet>()
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const { mutate } = useSWRConfig()

  const { mutate: saveSetMutate, isLoading: isSaveLoading } = useMutate()

  const saveSet = (formattedData: AfsResolve) => {
    void saveSetMutate(() =>
      applicationFlaggedSetsService
        .resolve({
          body: formattedData,
        })
        .then(() => {
          // next issue: set success alert
        })
        .catch((e) => {
          // next issue: set failure alert
          console.log(e)
        })
        .finally(() => {
          void mutate(cacheKey)
        })
    )
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues } = useForm()

  const selectFlaggedApps = (data: ApplicationFlaggedSet, gridApi: GridApi) => {
    if (!data || !gridApi) return
    gridApi.forEachNode((row) => {
      row.setSelected(
        row.data.reviewStatus === ApplicationReviewStatusEnum.pendingAndValid ||
          row.data.reviewStatus === ApplicationReviewStatusEnum.valid
      )
    })
  }

  const tableOptions = useAgTable()

  if (!data) return null

  const getTitle = () => {
    if (data.rule === RuleEnum.email) {
      return t(`flags.emailRule`, {
        email: data?.applications[0].applicant.emailAddress,
      })
    } else if (data?.rule === RuleEnum.nameAndDOB) {
      return t("flags.nameDobRule", {
        name: `${data?.applications[0].applicant.firstName} ${data?.applications[0].applicant.lastName}`,
      })
    } else if (data?.rule === RuleEnum.combination) {
      return t("flags.combindationRule", {
        name: `${data?.applications[0].applicant.firstName} ${data?.applications[0].applicant.lastName}`,
        email: data?.applications[0].applicant.emailAddress,
      })
    }
    return ""
  }

  const numberConfirmedApps = data?.applications?.filter(
    (app) => app.reviewStatus === ApplicationReviewStatusEnum.valid
  ).length

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <NavigationHeader
        className="relative"
        title={<p className="font-sans font-semibold text-2xl">{getTitle()}</p>}
      />

      <div>
        <StatusBar
          backButton={
            <Button
              leadIcon={
                <Icon size="sm">
                  <ChevronLeftIcon />
                </Icon>
              }
              variant="text"
              size="sm"
              className="font-semibold no-underline"
              onClick={() => router.back()}
            >
              {t("t.back")}
            </Button>
          }
        >
          <Tag
            className="tag-uppercase"
            variant={data?.status === FlaggedSetStatusEnum.resolved ? "success" : "primary"}
            size={"lg"}
          >
            {data?.status === FlaggedSetStatusEnum.resolved
              ? t("t.resolved")
              : t("applications.pendingReview")}
          </Tag>
        </StatusBar>
      </div>

      <section className="bg-gray-300 py-5">
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

          <div className="flex md:flex-row flex-col flex-wrap">
            <div className="md:w-9/12 md:pb-24 pb-8">
              {data?.showConfirmationAlert && (
                <AlertBox
                  className="mb-5 mt-1"
                  type={"success"}
                  closeable
                  onClose={async () => {
                    await applicationFlaggedSetsService?.resetConfirmationAlert({
                      body: { id: data.id },
                    })
                    void mutate(cacheKey)
                  }}
                >
                  {numberConfirmedApps !== 1
                    ? t("flags.confirmationAlertPlural", { amount: numberConfirmedApps })
                    : t("flags.confirmationAlertSingular")}
                </AlertBox>
              )}
              <p className={"text-lg font-semibold mb-5"}>{t("flags.selectValidApplications")}</p>
              <AgTable
                id="applications-table"
                className="w-full m-h-0"
                config={{
                  columns,
                  totalItemsLabel: t("applications.totalApplications"),
                  rowSelection: true,
                }}
                data={{
                  items: data.applications ?? [],
                  loading: isLoading,
                  totalItems: data.applications?.length ?? 0,
                  totalPages: 1,
                }}
                search={{
                  setSearch: tableOptions.filter.setFilterValue,
                  showSearch: false,
                }}
                selectConfig={{
                  setGridApi: setGridApi,
                  updateSelectedValues: () => selectFlaggedApps(data, gridApi),
                }}
              />
            </div>

            <aside className="md:w-3/12 md:pl-6">
              <section className={"w-full"}>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setSaveModalOpen(true)}
                  id={"save-set-button"}
                >
                  {t("t.save")}
                </Button>
                {data?.updatedAt && (
                  <div className="border-t text-xs flex items-center justify-center mt-4 pt-4">
                    {t("t.lastUpdated")}: {dayjs(data?.updatedAt).format("MMMM DD, YYYY")}
                  </div>
                )}
              </section>
            </aside>
          </div>
        </div>
      </section>
      <Dialog
        isOpen={!!saveModalOpen}
        ariaLabelledBy="application-review-dialog-header"
        onClose={() => setSaveModalOpen(false)}
      >
        <Dialog.Header id="application-review-dialog-header">
          {t("flags.updateStatus")}
        </Dialog.Header>
        <Dialog.Content>
          <Field
            id="setStatus.pending"
            name="setStatus"
            className="m-0"
            type="radio"
            label={t("applications.pendingReview")}
            register={register}
            inputProps={{
              value: "pending",
              defaultChecked: data?.status === FlaggedSetStatusEnum.pending,
            }}
          />
          <p className={"mb-6 ml-8 text-xs text-gray-800"}>{t("flags.pendingDescription")}</p>

          <Field
            id="setStatus.resolved"
            name="setStatus"
            className="m-0 border-t pt-6"
            type="radio"
            label={t("t.resolved")}
            register={register}
            inputProps={{
              value: "resolved",
              defaultChecked: data?.status === FlaggedSetStatusEnum.resolved,
            }}
          />
          <p className={"ml-8 text-xs text-gray-800"}>{t("flags.resolvedDescription")}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            type="button"
            variant="primary"
            size="sm"
            loadingMessage={isSaveLoading && t("t.formSubmitted")}
            onClick={() => {
              const selectedData = gridApi.getSelectedRows()
              const status = getValues()["setStatus"]
              saveSet({
                afsId: data?.id,
                applications: selectedData.map((row) => {
                  return { id: row.id }
                }),
                status:
                  status === "pending"
                    ? FlaggedSetStatusEnum.pending
                    : FlaggedSetStatusEnum.resolved,
              })
              setSaveModalOpen(false)
            }}
          >
            {t("t.save")}
          </Button>
          <Button
            type="button"
            variant="primary-outlined"
            size="sm"
            onClick={() => {
              setSaveModalOpen(false)
            }}
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </Layout>
  )
}

export default Flag
