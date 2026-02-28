import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, LoadingState, Heading, Tabs } from "@bloom-housing/ui-seeds"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  useToastyRef,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import {
  ApplicationsFilterEnum,
  PaginationMeta,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StatusItemWrapper, AppWithListing } from "./StatusItemWrapper"
import { UserStatus } from "../../lib/constants"
import styles from "./ApplicationsView.module.scss"

export enum ApplicationsIndexEnum {
  all = 0,
  lottery,
  closed,
  open,
}

interface ApplicationsCount {
  total: number
  lottery: number
  open: number
  closed: number
}

interface ApplicationsViewProps {
  filterType: ApplicationsIndexEnum
  enableApplicationStatus?: boolean
}

const ApplicationsView = (props: ApplicationsViewProps) => {
  const { applicationsService, profile } = useContext(AuthContext)
  const toastyRef = useToastyRef()
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [applicationsCount, setApplicationsCount] = useState<ApplicationsCount>()
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>()
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const router = useRouter()
  const showPublicLottery = process.env.showPublicLottery
  const filterTypeString = ApplicationsIndexEnum[props.filterType]
  const page = Number(router.query.page) || 1
  const isAdvocate = !!profile?.isAdvocate
  const minimumSearchCharacters = 3
  const searchDebounceMs = 500

  useEffect(() => {
    if (!isAdvocate) {
      setDebouncedSearch("")
      return
    }

    const trimmedSearch = searchInput.trim()

    const timeoutId = setTimeout(() => {
      setDebouncedSearch(trimmedSearch.length >= minimumSearchCharacters ? trimmedSearch : "")
    }, searchDebounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchInput, isAdvocate])

  useEffect(() => {
    if (profile) {
      setLoading(true)
      setError(undefined)
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: `My Applications - ${filterTypeString}`,
        status: UserStatus.LoggedIn,
      })
      applicationsService
        .publicAppsView({
          userId: profile.id,
          filterType: ApplicationsFilterEnum[filterTypeString],
          includeLotteryApps: !!showPublicLottery,
          page: page,
          limit: 10,
          applicantNameSearch: isAdvocate && debouncedSearch ? debouncedSearch : undefined,
        })
        .then((res) => {
          setApplications(res.items)
          setApplicationsCount(res.applicationsCount)
          setPaginationMeta(res.meta)
        })
        .catch((err) => {
          console.error(`Error fetching applications: ${err}`)
          toastyRef.current.addToast(t("account.errorFetchingApplications"), { variant: "alert" })
          setError(err)
        })
        .finally(() => {
          setLoading(false)
          setHasLoadedOnce(true)
        })
    }
  }, [
    profile,
    applicationsService,
    filterTypeString,
    showPublicLottery,
    page,
    debouncedSearch,
    isAdvocate,
    toastyRef,
  ])

  const selectionHandler = (index: number) => {
    const baseUrl = "/account/applications"
    switch (index) {
      case ApplicationsIndexEnum.all:
        void router.push(baseUrl)
        break
      case ApplicationsIndexEnum.lottery:
        void router.push(`${baseUrl}/lottery`)
        break
      case ApplicationsIndexEnum.closed:
        void router.push(`${baseUrl}/closed`)
        break
      case ApplicationsIndexEnum.open:
        void router.push(`${baseUrl}/open`)
        break
    }
  }

  const getPageHeader = () => {
    switch (props.filterType) {
      case ApplicationsIndexEnum.closed:
        return {
          title: t("account.closedApplications"),
          subtitle: t("account.closedApplicationsSubtitle"),
        }
      case ApplicationsIndexEnum.open:
        return {
          title: t("account.openApplications"),
          subtitle: t("account.openApplicationsSubtitle"),
        }
      case ApplicationsIndexEnum.all:
        return {
          title: t("account.allMyApplications"),
          subtitle: t("account.allMyApplicationsSubtitle"),
        }
      case ApplicationsIndexEnum.lottery:
        return {
          title: t("account.lotteryApplications"),
          subtitle: t("account.lotteryApplicationsSubtitle"),
        }
      default:
        return {
          title: t("account.myApplications"),
          subtitle: t("account.myApplicationsSubtitle"),
        }
    }
  }

  const { title, subtitle } = getPageHeader()

  const noApplicationsSection = () => {
    let headerText = t("account.noApplications")
    let buttonText = t("listings.browseListings")
    let buttonHref = "/listings"
    // only show custom message and redirect to "All my applications" if they have applied before
    if (applicationsCount?.total > 0) {
      buttonText = t("account.viewAllApplications")
      buttonHref = "/account/applications"
      switch (props.filterType) {
        case ApplicationsIndexEnum.lottery:
          headerText = t("account.noLotteryApplications")
          break
        case ApplicationsIndexEnum.closed:
          headerText = showPublicLottery
            ? t("account.noClosedApplications")
            : t("account.noClosedApplicationsSimplified")
          break
        case ApplicationsIndexEnum.open:
          headerText = t("account.noOpenApplications")
          break
      }
    }

    return (
      <Card.Section className={styles["account-card-applications-section"]}>
        <div className={styles["application-no-results"]}>
          {error ? (
            <Heading priority={2} size="xl">{`${t("account.errorFetchingApplications")}`}</Heading>
          ) : (
            <>
              <Heading priority={2} className={styles["application-no-results-text"]} size="xl">
                {headerText}
              </Heading>
              <Button size="sm" variant="primary-outlined" href={buttonHref}>
                {buttonText}
              </Button>
            </>
          )}
        </div>
      </Card.Section>
    )
  }

  const noUnfilteredResults = !loading && paginationMeta?.totalItems === 0 && !debouncedSearch

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout pageTitle={t("account.myApplications")}>
        <section className={styles["applications-section-background"]}>
          <div className={styles["applications-section-container"]}>
            <div>
              <Tabs
                verticalSidebar
                onSelect={(index) => selectionHandler(index)}
                selectedIndex={props.filterType}
              >
                <Tabs.TabList>
                  <Tabs.Tab
                    className={styles["application-count-tab"]}
                    data-testid="total-applications-tab"
                  >
                    <span>{t("account.allMyApplications")}</span>
                    <span>{applicationsCount?.total}</span>
                  </Tabs.Tab>
                  <Tabs.Tab
                    className={`${styles["application-count-tab"]} ${
                      !showPublicLottery ? styles["application-hide-tab"] : ""
                    }`}
                    data-testid="lottery-runs-tab"
                  >
                    <span>{t("account.lotteryRun")}</span>
                    <span>{applicationsCount?.lottery}</span>
                  </Tabs.Tab>
                  <Tabs.Tab
                    className={styles["application-count-tab"]}
                    data-testid="closed-applications-tab"
                  >
                    <span>{t("account.closedApplications")}</span>
                    <span>{applicationsCount?.closed}</span>
                  </Tabs.Tab>
                  <Tabs.Tab
                    className={styles["application-count-tab"]}
                    data-testid="open-applications-tab"
                  >
                    <span>{t("account.openApplications")}</span>
                    <span>{applicationsCount?.open}</span>
                  </Tabs.Tab>
                </Tabs.TabList>
              </Tabs>
              {/* // TODO: When application status copy is available and on the FAQ page, we can re-enable this */}
              {/* {props.enableApplicationStatus && (
                <div className={styles["application-faq-link"]}>
                  <Link href={"/faq"} className={"seeds-m-bs-4"}>
                    {t("application.details.applicationStatusFaqLink")}
                  </Link>
                </div>
              )} */}
            </div>
            <BloomCard
              iconSymbol="listBullet"
              iconClass={"card-icon"}
              headingClass={"seeds-large-heading"}
              title={title}
              subtitle={subtitle}
              headingPriority={1}
            >
              <>
                {hasLoadedOnce && isAdvocate && !noUnfilteredResults && (
                  <div className={styles["application-search-container"]}>
                    <label
                      htmlFor="applicant-name-search"
                      className={"field-label seeds-p-be-2 sr-only"}
                    >
                      {t("application.details.searchApplicants")}
                    </label>
                    <input
                      id="applicant-name-search"
                      type="search"
                      className={styles["application-search-input"]}
                      placeholder={t("application.details.searchApplicantsPlaceholder")}
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      data-testid="applicant-name-search"
                      aria-describedby="search-sub-note"
                    />
                    <p className={"field-sub-note seeds-m-be-2"} id="search-sub-note">
                      {t("application.details.enterAtLeast3CharactersToSearch")}
                    </p>
                  </div>
                )}
                <LoadingState loading={loading}>
                  {applications?.map((application, index) => {
                    return (
                      <StatusItemWrapper
                        key={index}
                        application={application}
                        enableApplicationStatus={props.enableApplicationStatus}
                        showApplicantName={isAdvocate}
                      />
                    )
                  })}
                  {!applications?.length && !loading && noApplicationsSection()}
                </LoadingState>
                {applications?.length > 0 && (
                  <div className={styles["pagination-section"]}>
                    <div className={styles["pagination-content-wrapper"]}>
                      <div className={styles["previous-button"]}>
                        {paginationMeta?.currentPage > 1 && (
                          <Button
                            onClick={() => {
                              void router.push({
                                pathname: router.pathname,
                                query: `page=${(paginationMeta?.currentPage - 1).toString()}`,
                              })
                            }}
                            variant="primary-outlined"
                            size="sm"
                          >
                            {t("t.previous")}
                          </Button>
                        )}
                      </div>
                      <div className={styles["page-info"]}>
                        {paginationMeta?.currentPage !== undefined &&
                          paginationMeta?.totalPages !== undefined &&
                          t("listings.browseListings.pageInfo", {
                            currentPage: paginationMeta?.currentPage,
                            totalPages: paginationMeta?.totalPages,
                          })}
                      </div>
                      <div className={styles["next-button"]}>
                        {paginationMeta?.currentPage < paginationMeta?.totalPages && (
                          <Button
                            onClick={() => {
                              void router.push({
                                pathname: router.pathname,
                                query: `page=${(paginationMeta?.currentPage + 1).toString()}`,
                              })
                            }}
                            variant="primary-outlined"
                            size="sm"
                          >
                            {t("t.next")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            </BloomCard>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default ApplicationsView
