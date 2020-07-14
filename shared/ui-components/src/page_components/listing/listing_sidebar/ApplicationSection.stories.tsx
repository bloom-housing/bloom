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
listing.waitlistCurrentSize = 0
listing.applicationDueDate = moment().add(10, "days").format()
export const dueSoon = () => <ApplicationSection listing={listing} />

const listing2 = Object.assign({}, Archer) as any
listing2.applicationOpenDate = moment().add(5, "days").format()
listing2.applicationDueDate = moment().add(10, "days").format()
listing2.waitlistCurrentSize = 0
export const openSoon = () => <ApplicationSection listing={listing2} />

const listing3 = Object.assign({}, Archer) as any
listing3.applicationOpenDate = moment().subtract(5, "days").format()
listing3.applicationDueDate = moment().add(10, "days").format()
listing3.waitlistCurrentSize = 0
export const openedAlready = () => <ApplicationSection listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
listing4.applicationOpenDate = moment().subtract(15, "days").format()
listing4.waitlistCurrentSize = 0
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationSection listing={listing4} />

const listing5 = Object.assign({}, Archer) as any
listing5.applicationDueDate = moment().add(10, "days").format()
listing5.waitlistCurrentSize = 0
export const withOpenWaitlist = () => <ApplicationSection listing={listing5} />

const listing6 = Object.assign({}, Archer) as any
listing6.applicationDueDate = moment().add(10, "days").format()
listing6.waitlistCurrentSize = 0
listing6.unitsAvailable = 2
export const withOpenWaitlistAndUnits = () => <ApplicationSection listing={listing6} />

const listing7 = Object.assign({}, Archer) as any
listing7.applicationDueDate = moment().add(10, "days").format()
export const closedWaitlist = () => <ApplicationSection listing={listing7} />
