import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  ModificationEnum,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, ListingList, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import MaxWidthLayout from "../../layouts/max-width"
import { useProfileFavoriteListings } from "../../lib/hooks"
import { isFeatureFlagOn } from "../../lib/helpers"
import { ListingCard } from "./ListingCard"
import styles from "./ListingBrowse.module.scss"

export interface ListingBrowseProps {
  openListings: Listing[]
  closedListings: Listing[]
  jurisdiction: Jurisdiction
  paginationData?: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

const isListingFavorited = (listing, favoriteListings) => {
  return favoriteListings.some((item) => item.id === listing.id)
}

export const ListingBrowse = (props: ListingBrowseProps) => {
  const router = useRouter()
  const { profile, userService } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])
  const [favoritedListings, updateFavorite] = useProfileFavoriteListings()

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.openListings.length,
      listingIds: props.openListings.map((listing) => listing.id),
    })

    setFavoriteListings(favoritedListings)
  }, [profile, props.openListings, favoritedListings, setFavoriteListings])

  const saveFavoriteFn = (listing) => {
    return (listingFavorited) => {
      void updateFavorite(listing, listingFavorited)
      if (listingFavorited) {
        setFavoriteListings([...favoriteListings, listing])
      } else {
        setFavoriteListings([...favoriteListings.filter((item) => item.id != listing.id)])
      }
    }
  }

  const isNextPageAvailable =
    props.paginationData && props.paginationData.currentPage < props.paginationData.totalPages
  const isPreviousPageAvailable = props.paginationData && props.paginationData.currentPage > 1

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />

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
              {/* TODO: Show both open and closed listings once we have designs for pagination: Issue #4448 */}
              <>
                {props.openListings.length > 0 ? (
                  <>
                    <ul>
                      {props.openListings.map((listing, index) => {
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
                            favorited={favoriteListings.some((item) => item.id === listing.id)}
                            setFavorited={saveFavoriteFn(listing)}
                          />
                        )
                      })}
                    </ul>
                    <ul className={"seeds-m-bs-content"}>
                      {props.closedListings.map((listing, index) => {
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
                            favorited={favoriteListings.some((item) => item.id === listing.id)}
                            setFavorited={saveFavoriteFn(listing)}
                          />
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <div className={styles["empty-state"]}>
                    <Heading size={"xl"} priority={2} className={styles["empty-heading"]}>
                      {t("listings.noOpenListings")}
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
