import React from "react"
import dayjs from "dayjs"
import { StatusItem } from "../../components/account/StatusItem"
import {
  Application,
  Listing,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export interface AppWithListing extends Application {
  fullListing?: Listing
}
interface StatusItemWrapperProps {
  application: AppWithListing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const applicationDueDate = props.application?.fullListing?.applicationDueDate
  const isListingClosed = props.application?.fullListing?.status === ListingsStatusEnum.closed

  return (
    <StatusItem
      applicationDueDate={applicationDueDate && dayjs(applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={!isListingClosed && `application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.fullListing?.name}
      listingURL={`/listing/${props.application?.fullListing?.id}/${props.application?.fullListing?.urlSlug}`}
      key={props.application?.id}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
