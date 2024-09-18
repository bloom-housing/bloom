import React, { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { AgTable, t, useAgTable, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Card, Dialog, Heading, Icon, Message } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationOrderByKeys,
  ListingsStatusEnum,
  LotteryStatusEnum,
  OrderByEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  useSingleListingData,
  useFlaggedApplicationsList,
  useApplicationsData,
  useApplicationsExport,
} from "../../../../lib/hooks"
import { ListingStatusBar } from "../../../../components/listings/ListingStatusBar"
import Layout from "../../../../layouts"
import { getColDefs } from "../../../../components/applications/ApplicationsColDefs"
import { ApplicationsSideNav } from "../../../../components/applications/ApplicationsSideNav"
import { NavigationHeader } from "../../../../components/shared/NavigationHeader"
import { ExportTermsDialog } from "../../../../components/shared/ExportTermsDialog"
import styles from "../../../../components/shared/ExportTermsDialog.module.scss"
import pageStyles from "../../../../../styles/applications.module.scss"

const ApplicationsList = () => {
  const { profile } = useContext(AuthContext)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const router = useRouter()
  const listingId = router.query.id as string

  const [applicationConfirmAddModal, setApplicationConfirmAddModal] = useState(false)
  const [applicationConfirmAddPostLotteryModal, setApplicationConfirmAddPostLotteryModal] =
    useState(false)

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { listingDto } = useSingleListingData(listingId)

  const listingJurisdiction = profile?.jurisdictions?.find(
    (jurisdiction) => jurisdiction.id === listingDto?.jurisdictions.id
  )
  const includeDemographicsPartner =
    profile?.userRoles?.isPartner && listingJurisdiction?.enablePartnerDemographics
  const { onExport, csvExportLoading } = useApplicationsExport(
    listingId,
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      includeDemographicsPartner) ??
      false
  )

  const shouldExpireData = !profile?.userRoles?.isAdmin

  const countyCode = listingDto?.jurisdictions?.name
  const listingName = listingDto?.name
  const isListingOpen = listingDto?.status === "active"
  const allowNewApps = listingDto?.status !== "closed" || profile?.userRoles?.isAdmin
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

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
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
    return getColDefs(maxHouseholdSize, countyCode)
  }, [maxHouseholdSize, countyCode])

  const gridComponents = {
    formatLinkCell,
  }

  const onSubmit = async () => {
    try {
      await onExport()
    } catch (e) {
      console.log(e)
    } finally {
      setIsTermsOpen(false)
    }
  }

  if (!applications || appsError) return <div>{t("t.errorOccurred")}</div>

  const expiryDate = dayjs(listingDto?.closedAt).add(45, "day")
  const formattedExpiryDate = expiryDate.format("MMMM D, YYYY")

  if (profile?.userRoles?.isLimitedJurisdictionalAdmin) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
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
            listingDto?.reviewOrderType === ReviewOrderTypeEnum.lottery
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

      <ListingStatusBar status={listingDto?.status} />

      {listingDto?.status === ListingsStatusEnum.closed &&
      shouldExpireData &&
      expiryDate <= dayjs() ? (
        <section className={pageStyles["expired"]}>
          <div className={pageStyles["parent"]}>
            <div className={pageStyles["container"]}>
              <div className={pageStyles["main"]}>
                <Card spacing={"lg"}>
                  <CardSection>
                    <Icon icon={faExclamationCircle} size="xl" />
                    <Heading priority={2} size={"2xl"}>
                      {t("applications.export.dataExpiryHeader")}
                    </Heading>
                    <div className={pageStyles["card-description"]}>
                      {t("applications.export.dataExpiryDescription")}
                    </div>
                  </CardSection>
                </Card>
              </div>
              <aside className={pageStyles["side"]} />
            </div>
          </div>
        </section>
      ) : (
        <section className={pageStyles["section"]}>
          <article className={pageStyles["article"]}>
            {listingDto && (
              <>
                <ApplicationsSideNav
                  className={pageStyles["navigation-container"]}
                  listingId={listingId}
                  listingOpen={isListingOpen}
                />
                <div className={pageStyles["content-container"]}>
                  {shouldExpireData && listingDto?.status === ListingsStatusEnum.closed && (
                    <Message
                      variant={"warn"}
                      fullwidth={true}
                      className={pageStyles["applications-expiration-message"]}
                    >
                      {t("applications.export.dataExpiryMessage", {
                        date: formattedExpiryDate,
                      })}
                    </Message>
                  )}
                  <AgTable
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
                      <div className={pageStyles["table-action-container"]}>
                        {allowNewApps && (
                          <Button
                            onClick={() => {
                              if (
                                process.env.showLottery &&
                                (listingDto.lotteryStatus === LotteryStatusEnum.ran ||
                                  listingDto.lotteryStatus ===
                                    LotteryStatusEnum.releasedToPartners ||
                                  listingDto.lotteryStatus === LotteryStatusEnum.publishedToPublic)
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
                            className={pageStyles["table-action"]}
                            id={"addApplicationButton"}
                          >
                            {t("applications.addApplication")}
                          </Button>
                        )}

                        <Button
                          variant="primary-outlined"
                          size="sm"
                          className={pageStyles["table-action"]}
                          onClick={() => setIsTermsOpen(true)}
                          loadingMessage={csvExportLoading && t("t.formSubmitted")}
                        >
                          {t("t.export")}
                        </Button>
                      </div>
                    }
                  />
                </div>

                <ExportTermsDialog
                  dialogHeader={t("applications.export.dialogHeader")}
                  id="applications"
                  isOpen={isTermsOpen}
                  onClose={() => setIsTermsOpen(false)}
                  onSubmit={onSubmit}
                >
                  <p>{t("applications.export.dialogAlert", { date: formattedExpiryDate })}</p>
                  <p>{t("applications.export.dialogSubheader")}</p>
                  <h2 className={styles["terms-of-use-text"]}>
                    {t("applications.export.termsOfUse")}
                  </h2>
                  <Markdown>
                    {t("applications.export.termsBody", { bold: styles["terms-bold-text"] })}
                  </Markdown>
                </ExportTermsDialog>
              </>
            )}
          </article>
        </section>
      )}
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
    </Layout>
  )
}

export default ApplicationsList
