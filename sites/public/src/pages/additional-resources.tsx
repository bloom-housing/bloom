import React, { useEffect, useContext } from "react"
import { UserStatus } from "../lib/constants"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import Resources from "../components/resources/Resources"

const AdditionalResources = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Additional Resources",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <Resources />
}

export default AdditionalResources
