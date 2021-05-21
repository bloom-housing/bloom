import * as React from "react"
import ReferralApplication from "./ReferralApplication"

export default {
  title: "Listing Sidebar/Referral Application",
}

export const referralApplicationBlock = () => {
  return (
    <ReferralApplication
      phoneNumber={"211"}
      description={`The permanent supportive housing units are referred directly through Alameda County's
  Coordinated Entry System. Households experiencing homelessness can call 211 in order to
  get connected to an Access Point to learn more about the coordinated entry system and
  access housing-related resources and information.`}
      title={"For further information"}
    />
  )
}
