import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { AuthContext, PageView, pushGtmEvent, RequireLogin } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import { ListingCard } from "../browse/ListingCard"
import styles from "../browse/ListingBrowse.module.scss"

interface FavoritesViewProps {
  listings: Listing[]
}

const FavoritesView = (props: FavoritesViewProps) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: `My Favorites`,
        status: UserStatus.LoggedIn,
      })
    }
  })

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myFavorites")}</title>
        </Head>
        <MetaTags title={t("account.myFavorites")} description="" />
        <PageHeader title={t("account.myFavorites")} />
        <div className={styles["listing-directory"]}>
          <div className={styles["content-wrapper"]}>
            <ul>
              {props.listings.map((listing, index) => {
                return <ListingCard listing={listing} key={index} />
              })}
            </ul>
          </div>
        </div>
      </Layout>
    </RequireLogin>
  )
}

export default FavoritesView
