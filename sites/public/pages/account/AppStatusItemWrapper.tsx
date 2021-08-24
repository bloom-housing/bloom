import React, { useContext, useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { AppStatusItem, AuthContext } from "@bloom-housing/ui-components"

interface AppStatusItemWrapperProps {
  application: Application
}

const AppStatusItemWrapper = (props: AppStatusItemWrapperProps) => {
  const { listingsService } = useContext(AuthContext)
  const [listing, setListing] = useState<Listing>()

  useEffect(() => {
    listingsService
      ?.retrieve({ listingId: props.application.listing.id })
      .then((retrievedListing) => {
        setListing(retrievedListing)
      })
      .catch((err) => console.error(`Error fetching listing: ${err}`))
  }, [listingsService, props.application])

  return listing ? (
    <AppStatusItem
      applicationDueDate={listing.applicationDueDate}
      applicationURL={`application/${props.application.id}`}
      applicationUpdatedAt={props.application.updatedAt}
      confirmationNumber={props.application.id}
      listingId={listing.id}
      listingName={listing.name}
      listingURL={`/listing/${listing.id}/${listing.urlSlug}`}
      key={props.application.id}
    />
  ) : (
    // Potential for a loading state here
    <></>
  )
}

export { AppStatusItemWrapper as default, AppStatusItemWrapper }
