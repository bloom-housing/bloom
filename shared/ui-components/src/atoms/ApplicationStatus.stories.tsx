import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import moment from "moment"
import ApplicationStatus from "./ApplicationStatus"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import SVG from "react-inlinesvg"

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default {
  component: ApplicationStatus,
  title: "Listing Sidebar|Application Status",
  decorators: [
    withA11y,
    (storyFn: any) => (
      <div>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}
/* eslint-enable @typescript-eslint/ban-ts-ignore */

const listing = Object.assign({}, Archer) as any
listing.applicationOpenDate = ""
listing.applicationDueDate = moment().add(10, "days").format()
export const dueSoonAndVivid = () => <ApplicationStatus listing={listing} vivid={true} />

const listingPast = Object.assign({}, Archer) as any
listingPast.applicationOpenDate = ""
listingPast.applicationDueDate = moment().subtract(10, "days").format()
export const pastDueAndVivid = () => <ApplicationStatus listing={listingPast} vivid={true} />

export const pastDue = () => <ApplicationStatus listing={listingPast} vivid={false} />

const listing2 = Object.assign({}, Archer) as any
listing2.applicationOpenDate = moment().add(5, "days").format()
listing2.applicationDueDate = moment().add(10, "days").format()
export const openSoon = () => <ApplicationStatus listing={listing2} />

const listing3 = Object.assign({}, Archer) as any
listing3.applicationOpenDate = moment().subtract(5, "days").format()
listing3.applicationDueDate = moment().add(10, "days").format()
export const openedAlready = () => <ApplicationStatus listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
listing4.applicationOpenDate = moment().subtract(15, "days").format()
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationStatus listing={listing4} />

const listing5 = Object.assign({}, Archer) as any
listing5.applicationOpenDate = moment().subtract(15, "days").format()
listing5.applicationDueDate = null
export const openedWithFCFS = () => <ApplicationStatus listing={listing5} />
