import React from "react"
import dayjs from "dayjs"
import { StatusItem } from "./StatusItem"
import {
  Application,
  Listing,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export interface AppWithListing extends Application {
  listings: Listing
}
interface StatusItemWrapperProps {
  application: AppWithListing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const applicationDueDate = props.application?.listings?.applicationDueDate
  const lotteryStartDate = props.application?.listings?.listingEvents[0]?.startDate
  const lotteryPublishDate = props.application?.listings?.lotteryLastPublishedAt
  return (
    <StatusItem
      applicationDueDate={applicationDueDate && dayjs(applicationDueDate).format("MMMM D, YYYY")}
      applicationURL={`/account/application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.listings?.name}
      listingURL={`/listing/${props.application?.listings?.id}`}
      listingStatus={props.application.listings.status}
      key={props.application?.id}
      lotteryStartDate={lotteryStartDate && dayjs(lotteryStartDate).format("MMMM D, YYYY")}
      lotteryPublishedDate={lotteryPublishDate && dayjs(lotteryPublishDate).format("MMMM D, YYYY")}
      lotteryResults={
        props.application?.listings?.lotteryStatus === LotteryStatusEnum.publishedToPublic
      }
      lotteryURL={`/account/application/${props.application?.id}/lottery-results`}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
