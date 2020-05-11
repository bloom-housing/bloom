import * as React from "react"
import moment from "moment"
import ApplicationSection from "./ApplicationSection"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default {
  component: ApplicationSection,
  title: "Listing Sidebar|Application Section",
}
/* eslint-enable @typescript-eslint/ban-ts-ignore */

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
listing.applicationDueDate = moment().add(10, "days").format()
export const dueSoon = () => <ApplicationSection listing={listing} />

const listing2 = Object.assign({}, Archer) as any
listing2.applicationOpenDate = moment().add(5, "days").format()
listing2.applicationDueDate = moment().add(10, "days").format()
export const openSoon = () => <ApplicationSection listing={listing2} />

const listing3 = Object.assign({}, Archer) as any
listing3.applicationOpenDate = moment().subtract(5, "days").format()
listing3.applicationDueDate = moment().add(10, "days").format()
export const openedAlready = () => <ApplicationSection listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
listing4.applicationOpenDate = moment().subtract(15, "days").format()
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationSection listing={listing4} />
