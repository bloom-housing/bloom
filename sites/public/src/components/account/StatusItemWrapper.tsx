import React from "react"
import dayjs from "dayjs"
import { t } from "@bloom-housing/ui-components"
import { getApplicationStatusVariant } from "@bloom-housing/shared-helpers/src/utilities/applicationStatus"
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
  enableApplicationStatus?: boolean
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const applicationDueDate = props.application?.listings?.applicationDueDate
  const lotteryStartDate = props.application?.listings?.listingEvents[0]?.startDate
  const lotteryLastPublishedAt = props.application?.listings?.lotteryLastPublishedAt

  let applicationStatus
  if (props.enableApplicationStatus) {
    if (props.application.markedAsDuplicate) {
      applicationStatus = {
        content: t("application.details.applicationStatus.duplicate"),
        variant: "secondary-inverse",
      }
    } else {
      const variant = getApplicationStatusVariant(props.application.status)
      applicationStatus = {
        content: t(`application.details.applicationStatus.${props.application.status}`),
        variant: variant,
      }
    }
  }

  return (
    <StatusItem
      applicationDueDate={applicationDueDate && dayjs(applicationDueDate).format("MMM D, YYYY")}
      applicationURL={`/account/application/${props.application?.id}`}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.listings?.name}
      listingURL={`/listing/${props.application?.listings?.id}`}
      listingStatus={props.application.listings.status}
      key={props.application?.id}
      lotteryStartDate={lotteryStartDate && dayjs(lotteryStartDate).format("MMM D, YYYY")}
      lotteryPublishedDate={
        lotteryLastPublishedAt && dayjs(lotteryLastPublishedAt).format("MMM D, YYYY")
      }
      lotteryResults={
        props.application?.listings?.lotteryStatus === LotteryStatusEnum.publishedToPublic &&
        !!props.application?.applicationLotteryPositions?.length
      }
      lotteryURL={`/account/application/${props.application?.id}/lottery-results`}
      lotteryStatus={props.application?.listings?.lotteryStatus}
      applicationStatus={applicationStatus}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
