import React, { useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"

type AuthGuardProps = {
  children: React.ReactElement
}

const ListingGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter()
  const listingId = router.query.id as string

  const { profile } = useContext(AuthContext)

  const leasingAgentInListingsIds = profile?.listings?.map((item) => item.id)

  const hasPrivileges =
    profile?.userRoles?.isAdmin ||
    profile?.userRoles?.isJurisdictionalAdmin ||
    profile?.userRoles?.isLimitedJurisdictionalAdmin ||
    leasingAgentInListingsIds?.includes(listingId)

  if (hasPrivileges) {
    return children
  }

  return null
}

export default ListingGuard
