import React, { useEffect, useContext } from "react"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import About from "../components/content-pages/About"
import { UserStatus } from "../lib/constants"

const AboutPage = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "About",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <About />
}

export default AboutPage
