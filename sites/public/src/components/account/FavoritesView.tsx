import React from "react"
import Head from "next/head"
import { RequireLogin } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../shared/MetaTags"
import { getListings } from "../../lib/helpers"

interface FavoritesViewProps {
  listings: Listing[]
}

const FavoritesView = (props: FavoritesViewProps) => {
  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myFavorites")}</title>
        </Head>
        <MetaTags title={t("account.myFavorites")} description="" />
        <PageHeader title={t("account.myFavorites")} />
        {getListings(props.listings)}
      </Layout>
    </RequireLogin>
  )
}

export default FavoritesView
