import React, { useEffect, useContext } from "react"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { ContentError } from "../components/page/ContentError"
import { ContentErrorDeprecated } from "../components/page/ContentErrorDeprecated"
import { UserStatus } from "../lib/constants"
import { sharedGetStaticProps } from "../lib/sharedPageProps"

// _error handles the rest, but it renders outside the routing table and cannot take these props,
// a server error would otherwise show the bundled support address.
const ServerErrorPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Server Error",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <>{process.env.showNewSeedsDesigns ? <ContentError /> : <ContentErrorDeprecated />}</>
}

export { ServerErrorPage as default, ServerErrorPage }

export const getStaticProps = sharedGetStaticProps
