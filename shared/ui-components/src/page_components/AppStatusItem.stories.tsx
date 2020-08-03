import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import AppStatusItem from "./AppStatusItem"
import { Application } from "@bloom-housing/backend-core/src/entity/application.entity"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import moment from "moment"
const listing = Object.assign({}, Archer) as any

export default {
  title: "PageComponents|AppStatusItem",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}
const application = new Application()
listing.applicationDueDate = moment().add(10, "days").format()
application.listing = listing
application.updatedAt = moment().toDate()

export const AppStatusItemPending = () => (
  <AppStatusItem status="inProgress" application={application}></AppStatusItem>
)

export const AppStatusItemSubmitted = () => (
  <AppStatusItem
    status="submitted"
    application={application}
    lotteryNumber="#98AU18"
  ></AppStatusItem>
)

const application2 = new Application()
const listing2 = Object.assign({}, Archer) as any
application2.listing = listing2

export const AppStatusItemPastDue = () => (
  <AppStatusItem status="inProgress" application={application2}></AppStatusItem>
)
