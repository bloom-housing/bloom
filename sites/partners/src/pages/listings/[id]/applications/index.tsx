import React, { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AgTable, t, useAgTable, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
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
  useZipExport,
} from "../../../../lib/hooks"
import { ListingStatusBar } from "../../../../components/listings/ListingStatusBar"
import Layout from "../../../../layouts"
import { getColDefs } from "../../../../components/applications/ApplicationsColDefs"
import { ApplicationsSideNav } from "../../../../components/applications/ApplicationsSideNav"
import { NavigationHeader } from "../../../../components/shared/NavigationHeader"

const ApplicationsList = () => {
  const { profile } = useContext(AuthContext)
  const router = useRouter()
  const listingId = router.query.id as string

  const [applicationConfirmAddModal, setApplicationConfirmAddModal] = useState(false)
  const [applicationConfirmAddPostLotteryModal, setApplicationConfirmAddPostLotteryModal] =
    useState(false)

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { listingDto } = useSingleListingData(listingId)

  const listingJurisdiction = profile?.jurisdictions.find(
    (jurisdiction) => jurisdiction.id === listingDto?.jurisdictions.id
  )
  const includeDemographicsPartner =
    profile?.userRoles?.isPartner && listingJurisdiction?.enablePartnerDemographics
  const { onExport, exportLoading } = useZipExport(
    listingId,
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      includeDemographicsPartner) ??
      false,
    false,
    !!process.env.applicationExportAsSpreadsheet
  )

  const listingName = listingDto?.name
  const isListingOpen = listingDto?.status === "active"
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
    return getColDefs(maxHouseholdSize)
  }, [maxHouseholdSize])

  const gridComponents = {
    formatLinkCell,
  }

  if (!applications || appsError) return <div>{t("t.errorOccurred")}</div>

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

      <section className={"bg-gray-200 pt-4"}>
        <article className="flex flex-col md:flex-row items-start gap-x-8 relative max-w-screen-xl mx-auto pb-8 px-4 flex-col">
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
                    <Button
                      onClick={() => {
                        if (
                          process.env.showLottery &&
                          (listingDto.lotteryStatus === LotteryStatusEnum.ran ||
                            listingDto.lotteryStatus === LotteryStatusEnum.releasedToPartners ||
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
                      id={"addApplicationButton"}
                    >
                      {t("applications.addApplication")}
                    </Button>

                    <Button
                      variant="primary-outlined"
                      size="sm"
                      onClick={() => onExport()}
                      loadingMessage={exportLoading && t("t.formSubmitted")}
                    >
                      {t("t.export")}
                    </Button>
                  </div>
                }
              />
            </>
          )}
        </article>
      </section>

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
