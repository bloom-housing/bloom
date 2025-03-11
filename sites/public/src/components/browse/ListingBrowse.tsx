import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import { Heading } from "@bloom-housing/ui-seeds"
import { Listing, ModificationEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, ListingList, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ListingCard } from "./ListingCard"
import styles from "./ListingBrowse.module.scss"
import { useProfileFavoriteListings } from "../../lib/hooks"

export interface ListingBrowseProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const isListingFavorited = (listing, favoriteListings) => {
  return favoriteListings.some((item) => item.id === listing.id)
}

export const ListingBrowse = (props: ListingBrowseProps) => {
  const { userService, profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])

  const originalFavoriteListings = useProfileFavoriteListings()

  useEffect(() => {
    setFavoriteListings(originalFavoriteListings)
  }, [originalFavoriteListings, setFavoriteListings])

  const updateFavorite = async (listing, listingFavorited) => {
    await userService.modifyFavoriteListings({
      body: {
        id: listing.id,
        action: listingFavorited ? ModificationEnum.add : ModificationEnum.remove,
      },
    })
  }

  const setFavoritedFn = (listing) => {
    return (listingFavorited) => {
      void updateFavorite(listing, listingFavorited)
      if (listingFavorited) {
        setFavoriteListings([...favoriteListings, listing])
      } else {
        setFavoriteListings([...favoriteListings.filter((item) => item.id != listing.id)])
      }
    }
  }

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.openListings.length,
      listingIds: props.openListings.map((listing) => listing.id),
    })
  }, [profile, props.openListings])

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
                  return (
                    <ListingCard
                      listing={listing}
                      key={index}
                      favorited={isListingFavorited(listing, favoriteListings)}
                      setFavorited={setFavoritedFn(listing)}
                    />
                  )
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
      </div>
    </Layout>
  )
}
