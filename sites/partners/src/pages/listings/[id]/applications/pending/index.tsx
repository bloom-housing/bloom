import React, { useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import {
  AgTable,
  t,
  useAgTable,
  Breadcrumbs,
  BreadcrumbLink,
  AlertBox,
} from "@bloom-housing/ui-components"
import {
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
  RuleEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, formatDateTime } from "@bloom-housing/shared-helpers"
import { useSingleListingData, useFlaggedApplicationsList } from "../../../../../lib/hooks"
import { ListingStatusBar } from "../../../../../components/listings/ListingStatusBar"
import Layout from "../../../../../layouts"
import { ApplicationsSideNav } from "../../../../../components/applications/ApplicationsSideNav"
import { NavigationHeader } from "../../../../../components/shared/NavigationHeader"
import { mergeApplicationNames } from "../../../../../lib/helpers"

const ApplicationsList = () => {
  const router = useRouter()
  const listingId = router.query.id as string
  const type = router.query.type as string

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { profile } = useContext(AuthContext)
  const { listingDto } = useSingleListingData(listingId)
  const listingName = listingDto?.name
  const isListingOpen = listingDto?.status === "active"
  let view = "pending"
  if (type && type === "name_dob") {
    view = "pendingNameAndDoB"
  } else if (type && type === "email") {
    view = "pendingEmail"
  }

  const { data: flaggedAppsData, loading: flaggedAppsLoading } = useFlaggedApplicationsList({
    listingId,
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    view,
    search: tableOptions.filter.filterValue,
  })

  const columns = [
    {
      headerName: t("applications.duplicates.duplicateGroup"),
      field: "id",
      cellRenderer: "formatLinkCell",
      valueGetter: ({ data }) => {
        return mergeApplicationNames(data.applications)
      },
      flex: 1,
      minWidth: 250,
    },

    {
      headerName: t("t.rule"),
      field: "rule",
      valueGetter: ({ data }) => {
        if (data.rule === RuleEnum.combination) {
          return t("applications.combination")
        }
        if (data.rule === RuleEnum.email) {
          return t("applications.email")
        }
        if (data.rule === RuleEnum.nameAndDOB) {
          return t("applications.namedob")
        }
        return data.rule
      },
      width: 250,
      minWidth: 200,
    },
    {
      headerName: t("applications.pendingReview"),
      field: "",
      valueGetter: ({ data }) => {
        return `${data?.applications?.length ?? 0}`
      },
      type: "rightAligned",
      width: 100,
      minWidth: 50,
    },
  ]

  class formatEnabledCell {
    linkWithId: HTMLSpanElement
    init(params) {
      const applicationId = params.data.id
      this.linkWithId = document.createElement("button")
      this.linkWithId.innerText = params.value
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.addEventListener("click", function () {
        void router.push(`/application/${applicationId}/review`)
      })
    }
    getGui() {
      return this.linkWithId
    }
  }
  class formatDisabledCell {
    disabledLink: HTMLSpanElement
    init(params) {
      this.disabledLink = document.createElement("button")
      this.disabledLink.innerText = params.value
      this.disabledLink.classList.add("text-gray-750")
      this.disabledLink.classList.add("cursor-default")
    }
    getGui() {
      return this.disabledLink
    }
  }

  const gridComponents = {
    formatLinkCell: isListingOpen ? formatDisabledCell : formatEnabledCell,
  }

  let afsLastRun
  if (listingDto?.afsLastRunAt) {
    const dayjsDate = dayjs(listingDto?.afsLastRunAt)
    afsLastRun = {
      date: dayjsDate?.format("MM/DD/YY"),
      time: dayjsDate?.format("hh:mma"),
    }
  }

  if (profile?.userRoles?.isLimitedJurisdictionalAdmin) return null

  return (
    <Layout>
      <Head>
        <title>{`Pending Applications - ${t("nav.siteTitlePartners")}`}</title>
      </Head>

      <NavigationHeader
        title={listingName}
        listingId={listingId}
        tabs={{
          show: true,
          flagsQty: flaggedAppsData?.meta?.totalFlagged,
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
            <BreadcrumbLink href={`/listings/${listingId}/applications`}>
              {t("nav.applications")}
            </BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications/pending`} current>
              {t("t.pending")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      />

      <ListingStatusBar status={listingDto?.status} />

      <section className={"bg-gray-200 pt-4"}>
        <article className="flex flex-col md:flex-row items-start gap-x-8 relative max-w-screen-xl mx-auto pb-6 px-4">
          {listingDto && (
            <>
              <ApplicationsSideNav
                className="w-full md:w-72"
                listingId={listingId}
                listingOpen={isListingOpen}
              />

              <div className="w-full">
                {isListingOpen && (
                  <AlertBox type="notice" className="mb-3" customIcon={"lock"} closeable>
                    {listingDto?.applicationDueDate
                      ? t("applications.duplicatesAlertDate", {
                          date: formatDateTime(listingDto.applicationDueDate, true),
                        })
                      : t("applications.duplicatesAlert")}
                  </AlertBox>
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
                    columns,
                    totalItemsLabel:
                      flaggedAppsData?.meta?.totalItems === 1
                        ? t("applications.duplicates.set")
                        : t("applications.duplicates.sets"),
                  }}
                  data={{
                    items: flaggedAppsData?.items ?? [],
                    loading: flaggedAppsLoading,
                    totalItems: flaggedAppsData?.meta?.totalItems ?? 0,
                    totalPages: flaggedAppsData?.meta?.totalPages ?? 0,
                  }}
                  search={{
                    setSearch: tableOptions.filter.setFilterValue,
                  }}
                  sort={{
                    setSort: tableOptions.sort.setSortOptions,
                  }}
                />
                {afsLastRun && (
                  <span className="text-gray-750 text-sm flex max-w-screen-xl mx-auto pt-6 pb-4 px-4 justify-end">
                    {`${t("t.lastUpdated")} ${afsLastRun.date} ${t("t.at")} ${afsLastRun.time}`}
                  </span>
                )}
              </div>
            </>
          )}
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
