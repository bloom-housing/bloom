import React, { useContext, useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { StatusItem, AuthContext } from "@bloom-housing/ui-components"
import dayjs from "dayjs"

interface StatusItemWrapperProps {
  application: Application
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const { listingsService } = useContext(AuthContext)
  const [listing, setListing] = useState<Listing>()

  useEffect(() => {
    listingsService
      ?.retrieve({ id: props.application.listing.id })
      .then((retrievedListing) => {
        setListing(retrievedListing)
      })
      .catch((err) => console.error(`Error fetching listing: ${err}`))
  }, [listingsService, props.application])

  return listing ? (
    <StatusItem
      applicationDueDate={dayjs(listing.applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={`application/${props.application.id}`}
      applicationUpdatedAt={dayjs(props.application.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application.confirmationCode || props.application.id}
      listingName={listing.name}
      listingURL={`/listing/${listing.id}/${listing.urlSlug}`}
      key={props.application.id}
    />
  ) : (
    // Potential for a loading state here
    <></>
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
