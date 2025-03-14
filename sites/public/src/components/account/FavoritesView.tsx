import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { AuthContext, PageView, pushGtmEvent, RequireLogin } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import { ListingCard } from "../browse/ListingCard"
import styles from "../browse/ListingBrowse.module.scss"
import favoritesStyles from "./FavoritesView.module.scss"
import { useProfileFavoriteListings } from "../../lib/hooks"
import { isFeatureFlagOn, saveListingFavorite } from "../../lib/helpers"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import { Button, Heading } from "@bloom-housing/ui-seeds"

interface FavoritesViewProps {
  jurisdiction: Jurisdiction
}

const FavoritesView = ({ jurisdiction }: FavoritesViewProps) => {
  const { profile, userService } = useContext(AuthContext)
  const listings = useProfileFavoriteListings()
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: `My Favorites`,
        status: UserStatus.LoggedIn,
      })

      setFavoriteListings(listings)
    }
  }, [profile, listings, setFavoriteListings])

  const saveFavoriteFn = (listing) => {
    return (listingFavorited) => {
      void saveListingFavorite(userService, listing.id, listingFavorited)
      if (listingFavorited) {
        setFavoriteListings([...favoriteListings, listing])
      } else {
        setFavoriteListings([...favoriteListings.filter((item) => item.id != listing.id)])
      }
    }
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myFavorites")}</title>
        </Head>
        <MetaTags title={t("account.myFavorites")} description="" />
        <PageHeaderLayout
          heading={t("account.myFavorites")}
          inverse
          className={listings.length === 0 ? favoritesStyles["favorites-none-layout"] : ""}
        >
          {listings.length === 0 ? (
            <div style={{ display: "grid", gap: "var(--seeds-s4)" }}>
              <Heading priority={2} size="3xl" className="font-alt-sans">
                It looks like you haven’t favorited any listings yet.
              </Heading>
              <p>
                <Button size="sm" variant="primary-outlined" href="/listings">
                  Browse listings
                </Button>
              </p>
            </div>
          ) : (
            <div className={styles["listing-directory"]}>
              <div
                className={[styles["content-wrapper"], favoritesStyles["favorites-listings"]].join(
                  " "
                )}
              >
                <ul>
                  {listings.map((listing, index) => {
                    return (
                      <ListingCard
                        listing={listing}
                        key={index}
                        showFavoriteButton={isFeatureFlagOn(
                          jurisdiction,
                          FeatureFlagEnum.showListingFavoriting
                        )}
                        favorited={favoriteListings.some((item) => item.id === listing.id)}
                        setFavorited={saveFavoriteFn(listing)}
                      />
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </PageHeaderLayout>
      </Layout>
    </RequireLogin>
  )
}

export default FavoritesView
