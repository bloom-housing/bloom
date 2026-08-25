import React, { useContext, useMemo, useState } from "react"
import Markdown from "markdown-to-jsx"
import { useRouter } from "next/router"
import Head from "next/head"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { AgTable, useAgTable } from "@bloom-housing/ui-components/ag-table"
import { Button, Dialog, LoadingState } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationOrderByKeys,
  FeatureFlagEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  OrderByEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  useSingleListingData,
  useFlaggedApplicationsList,
  useApplicationsData,
  useZipExport,
} from "../../../../lib/hooks"
import Layout from "../../../../layouts"
import { getColDefs } from "../../../../components/applications/ApplicationsColDefs"
import { ApplicationsSideNav } from "../../../../components/applications/ApplicationsSideNav"
import BulkUpdateDrawer from "../../../../components/applications/BulkUpdateDrawer"
import { getListingStatusTag } from "../../../../components/listings/helpers"
import { ExportTermsDialog } from "../../../../components/shared/ExportTermsDialog"
import styles from "../../../../components/shared/ExportTermsDialog.module.scss"
import ListingGuard from "../../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../../components/shared/NavigationHeader"
import { StatusBar } from "../../../../components/shared/StatusBar"

const ApplicationsList = () => {
  const { profile, doJurisdictionsHaveFeatureFlagOn, getJurisdiction } = useContext(AuthContext)
  const router = useRouter()
  const listingId = router.query.id as string

  const [applicationConfirmAddModal, setApplicationConfirmAddModal] = useState(false)
  const [applicationConfirmAddPostLotteryModal, setApplicationConfirmAddPostLotteryModal] =
    useState(false)
  const [bulkUpdateModalOpen, setBulkUpdateModalOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { listingDto, listingLoading } = useSingleListingData(listingId)

  const jurisdictionData = getJurisdiction(listingDto?.jurisdictions?.id)

  const disableWorkInRegion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableWorkInRegion,
    jurisdictionData?.id
  )
  const enableApplicationBulkCSVUpdates = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableApplicationBulkCSVUpdates,
    jurisdictionData?.id
  )
  const enableApplicationStatus = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableApplicationStatus,
    jurisdictionData?.id
  )
  const enableExportTerms = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableExportTerms,
    jurisdictionData?.id
  )
  const enableFullTimeStudentQuestion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableFullTimeStudentQuestion,
    jurisdictionData?.id
  )
  const enableHousingAdvocate = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingAdvocate,
    jurisdictionData?.id
  )
  const enableOnlyAdminCanAddAppsAfterClose = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableOnlyAdminCanAddAppsAfterClose,
    jurisdictionData?.id
  )
  const includeDemographicsPartner =
    profile?.userRoles?.isPartner && jurisdictionData?.enablePartnerDemographics

  const { onExport, exportLoading } = useZipExport(
    listingId,
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      includeDemographicsPartner) ??
      false,
    false,
    !!process.env.applicationExportAsSpreadsheet,
    !!process.env.useSecureDownloadPathway
  )

  const listingName = listingDto?.name
  const isListingOpen = listingDto?.status === "active"
  const allowNewApps = !(
    listingDto?.status === "closed" &&
    enableOnlyAdminCanAddAppsAfterClose &&
    (!profile.userRoles?.isAdmin || !profile.userRoles?.isSuperAdmin)
  )
  const { data: flaggedApps } = useFlaggedApplicationsList({
    listingId,
    page: 1,
    limit: 1,
  })

  const { applications, appsMeta, appsLoading, appsError } = useApplicationsData(
    tableOptions.pagination.currentPage,
    tableOptions.filter.filterValue,
    tableOptions.pagination.itemsPerPage,
    listingId,
    tableOptions.sort.sortOptions?.[0]?.orderBy as ApplicationOrderByKeys,
    tableOptions.sort.sortOptions?.[0]?.orderDir as OrderByEnum
  )

  const onSubmit = async () => {
    try {
      await onExport()
    } catch (e) {
      console.log(e)
    } finally {
      setIsTermsOpen(false)
    }
  }

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.style.textDecoration = "underline"
      this.linkWithId.innerText = params.value

      this.linkWithId.addEventListener("click", function () {
        void router.push(`/application/${applicationId}`)
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

  // get the highest value from householdSize and limit to 6
  const maxHouseholdSize = useMemo(() => {
    let max = 1

    applications?.forEach((item) => {
      if (item.householdSize > max) {
        max = item.householdSize
      }
    })

    return max < 6 ? max : 6
  }, [applications])

  const columnDefs = useMemo(() => {
    return getColDefs(
      maxHouseholdSize,
      enableFullTimeStudentQuestion,
      disableWorkInRegion,
      enableApplicationStatus,
      listingDto?.reviewOrderType,
      enableHousingAdvocate
    )
  }, [
    maxHouseholdSize,
    enableFullTimeStudentQuestion,
    disableWorkInRegion,
    enableApplicationStatus,
    listingDto?.reviewOrderType,
    enableHousingAdvocate,
  ])

  const gridComponents = {
    formatLinkCell,
  }

  if (!applications || appsError) return <div>{t("t.errorOccurred")}</div>

  if (profile?.userRoles?.isLimitedJurisdictionalAdmin) return null

  return (
    <ListingGuard>
      <Layout>
        <Head>
          <title>{`Applications - ${t("nav.siteTitlePartners")}`}</title>
        </Head>
        <div className={"loading-state-wrapper"}>
          <LoadingState loading={applications === undefined || listingLoading} className="w-full">
            <NavigationHeader
              title={listingName}
              listingId={listingId}
              tabs={{
                show: true,
                flagsQty: flaggedApps?.meta?.totalFlagged,
                listingLabel: t("t.listingSingle"),
                applicationsLabel: t("nav.applications"),
                lotteryLabel:
                  listingDto?.status === ListingsStatusEnum.closed &&
                  listingDto?.lotteryOptIn &&
                  (listingDto?.reviewOrderType === ReviewOrderTypeEnum.lottery ||
                    listingDto?.reviewOrderType === ReviewOrderTypeEnum.waitlistLottery)
                    ? t("listings.lotteryTitle")
                    : undefined,
              }}
              breadcrumbs={
                <Breadcrumbs>
                  <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
                  <BreadcrumbLink href={`/listings/${listingId}`}>{listingName}</BreadcrumbLink>
                  <BreadcrumbLink href={`/listings/${listingId}/applications`} current>
                    {t("nav.applications")}
                  </BreadcrumbLink>
                </Breadcrumbs>
              }
            />

            <StatusBar>{getListingStatusTag(listingDto?.status)}</StatusBar>

            <section className={"bg-gray-200 pt-4"}>
              <article className="flex flex-col md:flex-row items-start gap-x-8 relative max-w-screen-xl mx-auto pb-8 px-4">
                {listingDto && (
                  <>
                    <ApplicationsSideNav
                      className="w-full md:w-72"
                      listingId={listingId}
                      listingOpen={isListingOpen}
                    />

                    <AgTable
                      className="w-full"
                      id="applications-table"
                      pagination={{
                        perPage: tableOptions.pagination.itemsPerPage,
                        setPerPage: tableOptions.pagination.setItemsPerPage,
                        currentPage: tableOptions.pagination.currentPage,
                        setCurrentPage: tableOptions.pagination.setCurrentPage,
                      }}
                      config={{
                        gridComponents,
                        columns: columnDefs,
                        totalItemsLabel: t("applications.totalApplications"),
                      }}
                      data={{
                        items: applications,
                        loading: appsLoading,
                        totalItems: appsMeta?.totalItems,
                        totalPages: appsMeta?.totalPages,
                      }}
                      search={{
                        setSearch: tableOptions.filter.setFilterValue,
                      }}
                      sort={{
                        setSort: tableOptions.sort.setSortOptions,
                      }}
                      headerContent={
                        <div className="flex gap-2 items-center">
                          {allowNewApps && (
                            <Button
                              onClick={() => {
                                if (
                                  process.env.showLottery &&
                                  (listingDto.lotteryStatus === LotteryStatusEnum.ran ||
                                    listingDto.lotteryStatus ===
                                      LotteryStatusEnum.releasedToPartners ||
                                    listingDto.lotteryStatus ===
                                      LotteryStatusEnum.publishedToPublic)
                                ) {
                                  setApplicationConfirmAddPostLotteryModal(true)
                                } else if (listingDto.status === ListingsStatusEnum.closed) {
                                  setApplicationConfirmAddModal(true)
                                } else {
                                  void router.push(`/listings/${listingId}/applications/add`)
                                }
                              }}
                              variant="primary-outlined"
                              size="sm"
                              id={"addApplicationButton"}
                            >
                              {t("applications.addApplication")}
                            </Button>
                          )}

                          <Button
                            id={"applicationExportButton"}
                            variant="primary-outlined"
                            size="sm"
                            onClick={() => (enableExportTerms ? setIsTermsOpen(true) : onExport())}
                            loadingMessage={exportLoading && t("t.formSubmitted")}
                          >
                            {t("t.export")}
                          </Button>

                          {enableApplicationBulkCSVUpdates && (
                            <Button
                              id={"applicationBulkUpdateButton"}
                              variant="primary-outlined"
                              size="sm"
                              onClick={() => setBulkUpdateModalOpen(true)}
                            >
                              {t("applications.bulkUpdate")}
                            </Button>
                          )}
                        </div>
                      }
                    />
                    <ExportTermsDialog
                      dialogHeader={t("applications.export.dialogHeader")}
                      id="applicationExportTermsDialog"
                      isOpen={isTermsOpen}
                      onClose={() => setIsTermsOpen(false)}
                      onSubmit={onSubmit}
                    >
                      <p>{t("applications.export.dialogSubheader")}</p>
                      <h2 className={styles["terms-of-use-text"]}>
                        {t("authentication.terms.termsOfUse")}
                      </h2>
                      <Markdown>{t("applications.export.termsBody")}</Markdown>
                    </ExportTermsDialog>
                  </>
                )}
              </article>
            </section>
          </LoadingState>
        </div>

        <Dialog
          isOpen={applicationConfirmAddModal}
          onClose={() => setApplicationConfirmAddModal(false)}
          ariaLabelledBy="confirm-add-application-dialog-header"
        >
          <Dialog.Header id="confirm-add-application-dialog-header">
            {t("applications.addConfirmModalHeader")}
          </Dialog.Header>
          <Dialog.Content>{t("applications.addConfirmModalContent")}</Dialog.Content>
          <Dialog.Footer>
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push(`/listings/${listingId}/applications/add`)}
              size="sm"
            >
              {t("applications.addConfirmModalAddApplication")}
            </Button>
            <Button
              type="button"
              variant="primary-outlined"
              onClick={() => setApplicationConfirmAddModal(false)}
              size="sm"
            >
              {t("t.cancel")}
            </Button>
          </Dialog.Footer>
        </Dialog>

        <Dialog
          isOpen={applicationConfirmAddPostLotteryModal}
          onClose={() => setApplicationConfirmAddPostLotteryModal(false)}
          ariaLabelledBy="confirm-add-application-post-lottery-dialog-header"
        >
          <Dialog.Header id="confirm-add-application-post-lottery-dialog-header">
            {t("applications.addConfirmModalAddApplicationPostLotteryTitle")}
          </Dialog.Header>
          <Dialog.Content>
            <p>
              <span>{t("applications.addConfirmModalAddApplicationPostLottery")}</span>{" "}
              <span className={"font-semibold"}>
                {t("applications.addConfirmModalAddApplicationPostLotteryWeighted")}
              </span>
            </p>
            <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
          </Dialog.Content>
          <Dialog.Footer>
            <Button
              type="button"
              variant="alert"
              onClick={() => router.push(`/listings/${listingId}/applications/add`)}
              size="sm"
            >
              {t("applications.addConfirmModalAddApplicationPostLotteryConfirm")}
            </Button>
            <Button
              type="button"
              variant="primary-outlined"
              onClick={() => setApplicationConfirmAddPostLotteryModal(false)}
              size="sm"
            >
              {t("t.cancel")}
            </Button>
          </Dialog.Footer>
        </Dialog>

        <BulkUpdateDrawer
          isOpen={bulkUpdateModalOpen}
          onClose={() => setBulkUpdateModalOpen(false)}
        />
      </Layout>
    </ListingGuard>
  )
}

export default ApplicationsList
