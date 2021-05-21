import * as React from "react"

import moment from "moment"
import { ApplicationStatus } from "./ApplicationStatus"
import Archer from "../../__tests__/fixtures/archer.json"

export default {
  component: ApplicationStatus,
  title: "Notifications/Application Status",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>],
}

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
let days = 10
listing.applicationDueDate = moment().add(days, "days").format()
export const dueSoonAndVivid = () => <ApplicationStatus listing={listing} vivid={true} />

const listingPast = Object.assign({}, Archer) as any
listingPast.applicationOpenDate = ""
days = 10
listingPast.applicationDueDate = moment().subtract(days, "days").format()
export const pastDueAndVivid = () => <ApplicationStatus listing={listingPast} vivid={true} />

export const pastDue = () => <ApplicationStatus listing={listingPast} vivid={false} />

const listing2 = Object.assign({}, Archer) as any
days = 5
listing2.applicationOpenDate = moment().add(days, "days").format()
days = 10
listing2.applicationDueDate = moment().add(days, "days").format()
export const openSoon = () => <ApplicationStatus listing={listing2} />

export const openSoonVivid = () => <ApplicationStatus listing={listing2} vivid />

const listing3 = Object.assign({}, Archer) as any
days = 5
listing3.applicationOpenDate = moment().subtract(days, "days").format()
days = 10
listing3.applicationDueDate = moment().add(days, "days").format()
export const openedAlready = () => <ApplicationStatus listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
days = 15
listing4.applicationOpenDate = moment().subtract(days, "days").format()
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationStatus listing={listing4} />

const listing5 = Object.assign({}, Archer) as any
days = 15
listing5.applicationOpenDate = moment().subtract(days, "days").format()
listing5.applicationDueDate = null
export const openedWithFCFS = () => <ApplicationStatus listing={listing5} />

export const openedWithFCFSVivid = () => <ApplicationStatus listing={listing5} vivid />
