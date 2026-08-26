import React, { useEffect, useContext } from "react"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { ContentError } from "../components/page/ContentError"
import { ContentErrorDeprecated } from "../components/page/ContentErrorDeprecated"
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

  return <>{process.env.showNewSeedsDesigns ? <ContentError /> : <ContentErrorDeprecated />}</>
}

export { ErrorPage as default, ErrorPage }
