import React from "react"
import dayjs from "dayjs"
import { StatusItem } from "./StatusItem"
import {
  Application,
  Listing,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export interface AppWithListing extends Application {
  fullListing?: Listing
}
interface StatusItemWrapperProps {
  application: AppWithListing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const applicationDueDate = props.application?.fullListing?.applicationDueDate

  return (
    <StatusItem
      applicationDueDate={applicationDueDate && dayjs(applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={`/account/application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.fullListing?.name}
      listingURL={`/listing/${props.application?.fullListing?.id}/${props.application?.fullListing?.urlSlug}`}
      key={props.application?.id}
      lotteryResults={
        props.application?.fullListing?.lotteryStatus === LotteryStatusEnum.publishedToPublic
      }
      lotteryURL={`/account/application/${props.application?.id}/lottery-results`}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }