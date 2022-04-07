import React from "react"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { StatusItem } from "@bloom-housing/ui-components"
import dayjs from "dayjs"

interface StatusItemWrapperProps {
  application: Application
  listing: Listing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  // const { listingsService } = useContext(AuthContext)
  // const [listing, setListing] = useState<Listing>()

  // useEffect(() => {
  //   listingsService
  //     ?.retrieve({ id: props.application.listing.id })
  //     .then((retrievedListing) => {
  //       setListing(retrievedListing)
  //     })
  //     .catch((err) => console.error(`Error fetching listing: ${err}`))
  // }, [listingsService, props.application])

  return (
    <StatusItem
      applicationDueDate={dayjs(props.listing?.applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={`application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.listing?.name}
      listingURL={`/listing/${props.listing?.id}/${props.listing?.urlSlug}`}
      key={props.application?.id}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
