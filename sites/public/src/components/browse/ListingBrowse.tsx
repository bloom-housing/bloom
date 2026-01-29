import React, { useEffect, useContext, useState, useCallback } from "react"
import { useRouter } from "next/router"
import { Button, Card, Heading, LoadingState, Tabs } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  FeatureFlagEnum,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  AuthContext,
  BloomCard,
  ListingList,
  MessageContext,
  pushGtmEvent,
  ResponseException,
} from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import MaxWidthLayout from "../../layouts/max-width"
import { UserStatus } from "../../lib/constants"
import { fetchFavoriteListingIds, isFeatureFlagOn, saveListingFavorite } from "../../lib/helpers"
import { FilterDrawer } from "./FilterDrawer"
import {
  decodeQueryToFilterData,
  encodeFilterDataToQuery,
  FilterData,
  getFilterQueryFromURL,
} from "./FilterDrawerHelpers"
import { PageHeaderSection } from "../../patterns/PageHeaderLayout"
import { ListingCard } from "./ListingCard"
import styles from "./ListingBrowse.module.scss"

export enum TabsIndexEnum {
  open,
  closed,
}

export interface PaginationData {
  currentPage: number
  itemCount: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface ListingBrowseProps {
  listings: Listing[]
  jurisdiction: Jurisdiction
  multiselectData: MultiselectQuestion[]
  paginationData?: PaginationData
  tab: TabsIndexEnum
  areFiltersActive?: boolean
}

export const ListingBrowse = (props: ListingBrowseProps) => {
  const router = useRouter()
  const { profile, userService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [favoriteListingIds, setFavoriteListingIds] = useState<string[]>([])
  const [filterState, setFilterState] = useState<FilterData>({})
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const filterQuery = getFilterQueryFromURL(router.query)
  const enableFiltering = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableListingFiltering
  )

  const jurisdictionActiveFeatureFlags = props.jurisdiction?.featureFlags
    .filter((featureFlag) => featureFlag.active)
    .map((entry) => entry.name)

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.listings?.length,
      listingIds: props.listings?.map((listing) => listing.id),
    })

    if (profile) {
      void fetchFavoriteListingIds(profile.id, userService).then((listingIds) => {
        setFavoriteListingIds(listingIds)
      })
    }
  }, [profile, props.listings, setFavoriteListingIds, userService])

  useEffect(() => {
    const filterData = decodeQueryToFilterData(router.query)
    setFilterState(filterData)
    setIsLoading(false)
  }, [router.asPath, router.query])

  const saveFavoriteFn = (listingId: string) => {
    return (listingFavorited) => {
      saveListingFavorite(userService, listingId, listingFavorited)
        .then(() => {
          if (listingFavorited) {
            setFavoriteListingIds([...favoriteListingIds, listingId])
          } else {
            setFavoriteListingIds([...favoriteListingIds.filter((id) => id != listingId)])
          }
        })
        .catch((err) => {
          if (err instanceof ResponseException) {
            addToast(err.message, { variant: "alert" })
          } else {
            // Unknown exception
            console.error(err)
          }
        })
    }
  }

  const isNextPageAvailable =
    props.paginationData && props.paginationData.currentPage < props.paginationData.totalPages
  const isPreviousPageAvailable = props.paginationData && props.paginationData.currentPage > 1

  const selectionHandler = (index: number) => {
    switch (index) {
      case TabsIndexEnum.open:
        void router.push("/listings")
        break
      case TabsIndexEnum.closed:
        void router.push("/listings-closed")
        break
    }
  }

  const onFilterSubmit = (data: FilterData) => {
    const updatedFilterQuery = encodeFilterDataToQuery(data)
    setIsFilterDrawerOpen(false)
    if (updatedFilterQuery !== filterQuery) {
      setIsLoading(true)
      router.pathname.includes("listings-closed")
        ? void router.push(`/listings-closed?${updatedFilterQuery}`)
        : void router.push(`/listings?${updatedFilterQuery}`)
    }
  }

  const onFilterClear = (resetFilters: (data: FilterData) => void) => {
    if (Object.keys(filterState).length > 0) {
      setIsLoading(true)
      router.pathname.includes("listings-closed")
        ? void router.push(`/listings-closed`)
        : void router.push(`/listings`)
    }
    resetFilters({ name: "", monthlyRent: { minRent: "", maxRent: "" } })
    setFilterState({})
  }

  const onShowAll = useCallback(async () => {
    await router.replace(router.pathname)
  }, [router])

  const numberOfFilters = Object.values(filterState).filter((entry) => !!entry).length

  const ListingTabs = (
    <MaxWidthLayout>
      <Tabs className={styles["tabs"]} onSelect={selectionHandler} selectedIndex={props.tab}>
        <Tabs.TabList>
          <Tabs.Tab>{t("t.open")}</Tabs.Tab>
          <Tabs.Tab>{t("listings.closed")}</Tabs.Tab>
        </Tabs.TabList>
      </Tabs>
    </MaxWidthLayout>
  )

  return (
    <Layout pageTitle={t("pageTitle.rent")} metaDescription={metaDescription}>
      <PageHeaderSection heading={t("pageTitle.rent")} inverse={true} content={ListingTabs} />
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onSubmit={(data) => onFilterSubmit(data)}
        filterState={filterState}
        multiselectData={props.multiselectData}
        activeFeatureFlags={jurisdictionActiveFeatureFlags}
        onClear={onFilterClear}
        regions={props.jurisdiction?.regions}
        listingFeaturesConfiguration={props.jurisdiction?.listingFeaturesConfiguration}
      />
      <LoadingState loading={isLoading}>
        <div className={styles["listing-directory"]}>
          <div className={styles["browse-header"]}>
            <MaxWidthLayout className={styles["minimal-max-width-layout"]}>
              <div className={styles["browse-header-content"]}>
                <span className={styles["showing-listings"]}>
                  {props.paginationData &&
                    t("listings.browseListings.countInfo", {
                      currentCount: props.paginationData.itemCount,
                      totalCount: props.paginationData.totalItems,
                    })}
                </span>
                {enableFiltering && (
                  <span>
                    <Button
                      size={"sm"}
                      onClick={() => setIsFilterDrawerOpen(true)}
                      variant={"primary-outlined"}
                    >
                      {t("t.filter")}
                      {!!numberOfFilters && <span>{numberOfFilters}</span>}
                    </Button>
                  </span>
                )}
              </div>
            </MaxWidthLayout>
          </div>
          <div className={styles["content-wrapper"]}>
            <MaxWidthLayout className={styles["listings-max-width-layout"]}>
              <div className={styles["content"]}>
                <>
                  {!isLoading && props.listings?.length > 0 ? (
                    <ul>
                      {props.listings.map((listing, index) => {
                        return (
                          <ListingCard
                            listing={listing}
                            key={index}
                            jurisdiction={props.jurisdiction}
                            showFavoriteButton={
                              profile &&
                              isFeatureFlagOn(
                                props.jurisdiction,
                                FeatureFlagEnum.enableListingFavoriting
                              )
                            }
                            favorited={favoriteListingIds.includes(listing.id)}
                            setFavorited={saveFavoriteFn(listing.id)}
                            showHomeType={isFeatureFlagOn(
                              props.jurisdiction,
                              FeatureFlagEnum.enableHomeType
                            )}
                          />
                        )
                      })}
                    </ul>
                  ) : (
                    <div className={styles["empty-state"]}>
                      {props.areFiltersActive ? (
                        <BloomCard
                          title={
                            props.tab === TabsIndexEnum.open
                              ? t("listings.noMatchingOpenListings")
                              : t("listings.noMatchingClosedListings")
                          }
                          subtitle={t("listings.removeFilters")}
                          variant="block"
                          iconSymbol="listBullet"
                          iconClass={styles["empty-state-icon"]}
                          headingPriority={2}
                          altHeading
                        >
                          <Card.Section className={styles["button-wrapper"]}>
                            <Button variant="primary-outlined" onClick={onShowAll}>
                              {t("listings.showAll")}
                            </Button>
                          </Card.Section>
                        </BloomCard>
                      ) : (
                        <Heading size={"xl"} priority={2} className={styles["empty-heading"]}>
                          {props.tab === TabsIndexEnum.open
                            ? t("listings.noOpenListings")
                            : t("listings.noClosedListings")}
                        </Heading>
                      )}
                    </div>
                  )}
                </>
              </div>
            </MaxWidthLayout>
          </div>
          {props.paginationData && (
            <div className={styles["pagination-container"]}>
              <MaxWidthLayout className={styles["minimal-max-width-layout"]}>
                <div className={styles["pagination-content-wrapper"]}>
                  <div className={styles["previous-button"]}>
                    {isPreviousPageAvailable && (
                      <Button
                        onClick={() => {
                          props.paginationData.currentPage > 0 &&
                            router.push({
                              pathname: router.pathname,
                              query: `page=${(props.paginationData.currentPage - 1).toString()}${
                                filterQuery ? `&${filterQuery}` : ""
                              }`,
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
                    {t("listings.browseListings.pageInfo", {
                      currentPage: props.paginationData.currentPage,
                      totalPages: props.paginationData.totalPages,
                    })}
                  </div>
                  <div className={styles["next-button"]}>
                    {isNextPageAvailable && (
                      <Button
                        onClick={() => {
                          props.paginationData.currentPage < props.paginationData.totalPages &&
                            router.push({
                              pathname: router.pathname,
                              query: `page=${(props.paginationData.currentPage + 1).toString()}${
                                filterQuery ? `&${filterQuery}` : ""
                              }`,
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
              </MaxWidthLayout>
            </div>
          )}
        </div>
      </LoadingState>
    </Layout>
  )
}
