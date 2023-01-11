import React from "react"
import dayjs from "dayjs"
import { Application, Listing } from "@bloom-housing/backend-core"
import { StatusItem } from "../../components/account/StatusItem"

export interface AppWithListing extends Application {
  fullListing?: Listing
}
interface StatusItemWrapperProps {
  application: AppWithListing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  return (
    <StatusItem
      applicationDueDate={dayjs(props.application?.fullListing?.applicationDueDate).format(
        "MMMM D, YYYY"
      )}
      applicationURL={`application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.fullListing?.name}
      listingURL={`/listing/${props.application?.fullListing?.id}/${props.application?.fullListing?.urlSlug}`}
      key={props.application?.id}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
