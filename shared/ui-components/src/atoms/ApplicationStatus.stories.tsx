import * as React from "react"
import moment from "moment"
import ApplicationStatus from "./ApplicationStatus"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default {
  component: ApplicationStatus,
  title: "Listing Sidebar|Application Status"
}
/* eslint-enable @typescript-eslint/ban-ts-ignore */

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
listing.applicationDueDate = moment()
  .add(10, "days")
  .format()
export const dueSoon = () => <ApplicationStatus listing={listing} />

const listing2 = Object.assign({}, Archer) as any
listing2.applicationOpenDate = moment()
  .add(5, "days")
  .format()
listing2.applicationDueDate = moment()
  .add(10, "days")
  .format()
export const openSoon = () => <ApplicationStatus listing={listing2} />

const listing3 = Object.assign({}, Archer) as any
listing3.applicationOpenDate = moment()
  .subtract(5, "days")
  .format()
listing3.applicationDueDate = moment()
  .add(10, "days")
  .format()
export const openedAlready = () => <ApplicationStatus listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
listing4.applicationOpenDate = moment()
  .subtract(15, "days")
  .format()
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationStatus listing={listing4} />
