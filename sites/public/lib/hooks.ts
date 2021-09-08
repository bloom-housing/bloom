import { useContext, useEffect, useState } from "react"
import qs from "qs"
import moment from "moment"
import { useRouter } from "next/router"
import axios from "axios"
import useSWR from "swr"
import {
  ApplicationStatusProps,
  isInternalLink,
  openDateState,
  t,
  encodeToBackendFilterString,
  encodeToBackendFilterArray,
} from "@bloom-housing/ui-components"
import { Listing, ListingReviewOrder, ListingFilterParams } from "@bloom-housing/backend-core/types"
import { AppSubmissionContext } from "./AppSubmissionContext"
import { ParsedUrlQuery } from "querystring"

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

const listingsFetcher = function () {
  return async (url: string, page: number, limit: number, filters: ListingFilterParams) => {
    const res = await axios.get(url, {
      params: {
        page: page,
        limit: limit,
        filter: encodeToBackendFilterArray(filters),
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
    return res.data
  }
}

// TODO: move this so it can be shared with the partner site.
export function useListingsData(pageIndex: number, limit = 10, filters: ListingFilterParams) {
  const { data, error } = useSWR(
    [`${process.env.listingServiceUrl}`, pageIndex, limit, filters],
    listingsFetcher()
  )

  return {
    listingsData: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export const useGetApplicationStatusProps = (listing: Listing): ApplicationStatusProps => {
  const [props, setProps] = useState({ content: "", subContent: "" })

  useEffect(() => {
    if (!listing) return
    let content = ""
    let subContent = ""
    let formattedDate = ""
    if (openDateState(listing)) {
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
