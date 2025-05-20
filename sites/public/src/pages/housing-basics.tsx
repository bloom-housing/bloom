import React, { useEffect, useContext } from "react"
import { UserStatus } from "../lib/constants"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import HousingBasics from "../components/content-pages/HousingBasics"

const HousingBasicsPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Affordable Housing Basics",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <HousingBasics />
}

export default HousingBasicsPage
