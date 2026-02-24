import React, { useContext } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { EditPublicAccount } from "../../components/account/EditPublicAccount"
import { EditAdvocateAccount } from "../../components/account/EditAdvocateAccount"

const Edit = () => {
  const { profile } = useContext(AuthContext)
  return profile?.isAdvocate ? <EditAdvocateAccount /> : <EditPublicAccount />
}

export default Edit
