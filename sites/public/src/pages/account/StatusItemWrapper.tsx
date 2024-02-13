import React from "react"
import dayjs from "dayjs"
import { StatusItem } from "../../components/account/StatusItem"
import {
  Application,
  Listing,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"

export interface AppWithListing extends Application {
  fullListing?: Listing
}
interface StatusItemWrapperProps {
  application: AppWithListing
}

const StatusItemWrapper = (props: StatusItemWrapperProps) => {
  const applicationDueDate = props.application?.fullListing?.applicationDueDate
  const listing = props.application?.fullListing
  const formattedApplicationDueDate =
    applicationDueDate && dayjs(applicationDueDate).format("MMMM D, YYYY")

  const status =
    listing?.status === ListingsStatusEnum.active &&
    (dayjs(new Date()).isBefore(dayjs(applicationDueDate)) || listing?.waitlistOpenSpots)
      ? t("application.statuses.openApplications")
      : t("application.statuses.closedApplications")

  return (
    <StatusItem
      applicationDueDate={formattedApplicationDueDate}
      applicationURL={`application/${props.application?.id}`}
      applicationUpdatedAt={dayjs(props.application?.updatedAt).format("MMMM D, YYYY")}
      confirmationNumber={props.application?.confirmationCode || props.application?.id}
      listingName={props.application?.fullListing?.name}
      listingURL={`/listing/${listing?.id}/${listing?.urlSlug}`}
      key={props.application?.id}
      strings={{ submittedStatus: status }}
    />
  )
}

export { StatusItemWrapper as default, StatusItemWrapper }
