import { useContext, useEffect } from "react"
import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Assistance from "../components/assistance/Assistance"

const GetAssisatance = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Get Assistance",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <Assistance />
}

export default GetAssisatance
