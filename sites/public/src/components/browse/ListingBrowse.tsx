import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Button, Heading, Tabs } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  AuthContext,
  ListingList,
  MessageContext,
  pushGtmEvent,
  ResponseException,
} from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import MaxWidthLayout from "../../layouts/max-width"
import { fetchFavoriteListingIds, isFeatureFlagOn, saveListingFavorite } from "../../lib/helpers"
import { PageHeaderSection } from "../../patterns/PageHeaderLayout"
import { ListingCard } from "./ListingCard"
import styles from "./ListingBrowse.module.scss"

export enum TabsIndexEnum {
  open,
  closed,
}

export interface ListingBrowseProps {
  listings: Listing[]
  jurisdiction: Jurisdiction
  paginationData?: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
  tab: TabsIndexEnum
}

export const ListingBrowse = (props: ListingBrowseProps) => {
  const router = useRouter()
  const { profile, userService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const [favoriteListingIds, setFavoriteListingIds] = useState<string[]>([])

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.listings.length,
      listingIds: props.listings.map((listing) => listing.id),
    })

    if (profile) {
      void fetchFavoriteListingIds(profile.id, userService).then((listingIds) => {
        setFavoriteListingIds(listingIds)
      })
    }
  }, [profile, props.listings, setFavoriteListingIds, userService])

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
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} description={metaDescription} />
      <PageHeaderSection heading={t("pageTitle.rent")} inverse={true} content={ListingTabs} />
      <div className={styles["listing-directory"]}>
        {props.paginationData && (
          <div className={styles["browse-header"]}>
            <MaxWidthLayout className={styles["minimal-max-width-layout"]}>
              <div className={styles["browse-header-content"]}>
                <span className={styles["showing-listings"]}>
                  {t("listings.browseListings.countInfo", {
                    currentCount: props.paginationData.itemCount,
                    totalCount: props.paginationData.totalItems,
                  })}
                </span>
                <span>
                  <Button size={"sm"} variant={"primary-outlined"}>
                    Filter
                  </Button>
                </span>
              </div>
            </MaxWidthLayout>
          </div>
        )}
        <div className={styles["content-wrapper"]}>
          <MaxWidthLayout className={styles["listings-max-width-layout"]}>
            <div className={styles["content"]}>
              <>
                {props.listings?.length > 0 ? (
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
                    <Heading size={"xl"} priority={2} className={styles["empty-heading"]}>
                      {props.tab === TabsIndexEnum.open
                        ? t("listings.noOpenListings")
                        : t("listings.noClosedListings")}
                    </Heading>
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
                      onClick={() =>
                        props.paginationData.currentPage > 0 &&
                        router.push({
                          pathname: router.pathname,
                          query: `page=${(props.paginationData.currentPage - 1).toString()}`,
                        })
                      }
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
                      onClick={() =>
                        props.paginationData.currentPage < props.paginationData.totalPages &&
                        router.push({
                          pathname: router.pathname,
                          query: `page=${(props.paginationData.currentPage + 1).toString()}`,
                        })
                      }
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
    </Layout>
  )
}
