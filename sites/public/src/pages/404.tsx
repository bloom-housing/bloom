import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../layouts/application"
import { Content404 } from "../components/page/Content404"
import { Content404Deprecated } from "../components/page/Content404Deprecated"
import { UserStatus } from "../lib/constants"

const ErrorPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Page Not Found",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("errors.notFound.title")}>
      {process.env.showNewSeedsDesigns ? <Content404 /> : <Content404Deprecated />}
    </Layout>
  )
}

export { ErrorPage as default, ErrorPage }
