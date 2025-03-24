import React, { useEffect, useContext } from "react"
import Head from "next/head"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, ListingList, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ListingCard } from "./ListingCard"
import styles from "./ListingBrowse.module.scss"
import { useRouter } from "next/router"

export interface ListingBrowseProps {
  openListings: Listing[]
  closedListings: Listing[]
  paginationData?: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export const ListingBrowse = (props: ListingBrowseProps) => {
  const router = useRouter()
  const { profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.openListings.length,
      listingIds: props.openListings.map((listing) => listing.id),
    })
  }, [profile, props.openListings])

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
        <div className={styles["content-wrapper"]}>
          {/* TODO: Show both open and closed listings once we have designs for pagination: Issue #4448 */}
          <>
            {props.openListings.length > 0 ? (
              <ul>
                {props.openListings.map((listing, index) => {
                  return <ListingCard listing={listing} key={index} />
                })}
              </ul>
            ) : (
              <div className={styles["empty-state"]}>
                <Heading size={"xl"} priority={2} className={styles["empty-heading"]}>
                  {t("listings.noOpenListings")}
                </Heading>
              </div>
            )}
          </>
        </div>
        {props.paginationData && (
          <div className={styles["pagination-container"]}>
            <div className={styles["pagination-content-wrapper"]}>
              {" "}
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
          </div>
        )}
      </div>
    </Layout>
  )
}
