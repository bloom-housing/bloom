import { useContext, useEffect, useState } from "react"
import axios from "axios"
import moment from "moment"
import qs from "qs"
import { useRouter } from "next/router"
import { ApplicationStatusProps, isInternalLink, t } from "@bloom-housing/ui-components"
import { Jurisdiction, Listing, ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { AppSubmissionContext } from "./AppSubmissionContext"
import { openInFuture } from "../lib/helpers"

export const useRedirectToPrevPage = (defaultPath = "/") => {
  const router = useRouter()

  return (queryParams: ParsedUrlQuery = {}) => {
    const redirectUrl =
      typeof router.query.redirectUrl === "string" && isInternalLink(router.query.redirectUrl)
        ? router.query.redirectUrl
        : defaultPath
    const redirectParams = { ...queryParams }
    if (router.query.listingId) redirectParams.listingId = router.query.listingId

    return router.push({ pathname: redirectUrl, query: redirectParams })
  }
}

export const useFormConductor = (stepName: string) => {
  const context = useContext(AppSubmissionContext)
  const conductor = context.conductor

  conductor.stepTo(stepName)

  useEffect(() => {
    conductor.skipCurrentStepIfNeeded()
  }, [conductor])
  return context
}

export const useGetApplicationStatusProps = (listing: Listing): ApplicationStatusProps => {
  const [props, setProps] = useState({ content: "", subContent: "" })

  useEffect(() => {
    if (!listing) return
    let content = ""
    let subContent = ""
    let formattedDate = ""
    if (openInFuture(listing)) {
      const date = listing.applicationOpenDate
      const openDate = moment(date)
      formattedDate = openDate.format("MMM. D, YYYY")
      content = t("listings.applicationOpenPeriod")
    } else {
      if (listing.applicationDueDate) {
        const dueDate = moment(listing.applicationDueDate)
        const dueTime = moment(listing.applicationDueTime)
        formattedDate = dueDate.format("MMM. DD, YYYY")
        if (listing.applicationDueTime) {
          formattedDate = formattedDate + ` ${t("t.at")} ` + dueTime.format("h:mm A")
        }
        // if due date is in future, listing is open
        if (moment() < dueDate) {
          content = t("listings.applicationDeadline")
        } else {
          content = t("listings.applicationsClosed")
        }
      }
    }
    content = formattedDate !== "" ? `${content}: ${formattedDate}` : content
    if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
      subContent = content
      content = t("listings.applicationFCFS")
    }

    setProps({ content, subContent })
  }, [listing])

  return props
}

/**
 * This is fired server side by getStaticProps
 * By setting listingData here, we can continue to serve listings if the fetch fails.
 * This more of a temporary solution.
 */
let listingData = []

export async function fetchBaseListingData() {
  try {
    const { id: jurisdictionId } = await fetchJurisdictionByName()
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "<>",
            status: "pending",
          },
          {
            $comparison: "=",
            jurisdiction: jurisdictionId,
          },
        ],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })

    listingData = response.data?.items ?? []
  } catch (error) {
    console.log("fetchBaseListingData error = ", error)
  }

  return listingData
}

let jurisdiction: Jurisdiction

export async function fetchJurisdictionByName() {
  try {
    if (jurisdiction) {
      return jurisdiction
    }

    const jurisdictionName = process.env.jurisdictionName
    const jurisdictionRes = await axios.get(
      `${process.env.backendApiBase}/jurisdictions/byName/${jurisdictionName}`
    )
    jurisdiction = jurisdictionRes?.data

    return jurisdiction
  } catch (error) {
    console.log("error = ", error)
  }
}
