import React, { useContext, useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { AppStatusItem, AuthContext } from "@bloom-housing/ui-components"
import moment from "moment"

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
      applicationDueDate={moment(listing.applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={`application/${props.application.id}`}
      applicationUpdatedAt={moment(props.application.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application.id}
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
