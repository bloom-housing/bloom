import React, { useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../listings/ListingContext"

type AuthGuardProps = {
  children: React.ReactElement
}

const ListingGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter()
  const listingId = router.query.id as string

  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const listing = useContext(ListingContext)

  const leasingAgentInListingsIds = profile?.listings?.map((item) => item.id)
  const isEditRoute = router.pathname === "/listings/[id]/edit"
  const disablePartnerOpenListingEdits = doJurisdictionsHaveFeatureFlagOn?.(
    FeatureFlagEnum.disablePartnerOpenListingEdits,
    listing?.jurisdictions?.id
  )
  const isEditOpenListingRestricted =
    isEditRoute &&
    !!profile?.userRoles?.isPartner &&
    disablePartnerOpenListingEdits &&
    listing?.status === ListingsStatusEnum.active

  const hasPrivileges =
    profile?.userRoles?.isAdmin ||
    profile?.userRoles?.isSupportAdmin ||
    profile?.userRoles?.isJurisdictionalAdmin ||
    profile?.userRoles?.isLimitedJurisdictionalAdmin ||
    leasingAgentInListingsIds?.includes(listingId)

  if (isEditOpenListingRestricted && listingId) {
    window.location.href = `/listings/${listingId}`
    return null
  }

  if (hasPrivileges) {
    return children
  }

  window.location.href = "/unauthorized"
  return null
}

export default ListingGuard
