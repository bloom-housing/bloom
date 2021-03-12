import React, { useContext, useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { AppStatusItem, ApiClientContext } from "@bloom-housing/ui-components"

interface AppStatusItemWrapperProps {
  application: Application
}

const AppStatusItemWrapper = (props: AppStatusItemWrapperProps) => {
  const { listingsService } = useContext(ApiClientContext)
  const [listing, setListing] = useState<Listing>()

  useEffect(() => {
    listingsService
      ?.retrieve({ listingId: props.application.listing.id })
      .then((retrievedListing) => {
        setListing(retrievedListing)
      })
  }, [])

  return listing ? (
    <AppStatusItem application={props.application} listing={listing} key={props.application.id} />
  ) : (
    // Potential for a loading state here
    <></>
  )
}

export { AppStatusItemWrapper as default, AppStatusItemWrapper }
