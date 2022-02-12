import { useContext, useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"
import qs from "qs"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  ApplicationStatusProps,
  isInternalLink,
  t,
  encodeToBackendFilterArray,
  ListingFilterState,
} from "@bloom-housing/ui-components"
import {
  Listing,
  ListingReviewOrder,
  OrderByFieldsEnum,
  ListingStatus,
  Jurisdiction,
} from "@bloom-housing/backend-core/types"
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

const listingsFetcher = function () {
  return async (
    url: string,
    page: number,
    limit: number,
    filters: ListingFilterState,
    orderBy: OrderByFieldsEnum
  ) => {
    const res = await axios.get(url, {
      params: {
        view: "base",
        page: page,
        limit: limit,
        filter: encodeToBackendFilterArray(filters),
        orderBy: orderBy,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
    return res.data
  }
}

// TODO: move this so it can be shared with the partner site.
export function useListingsData(
  pageIndex: number,
  limit = 10,
  filters: ListingFilterState,
  orderBy: OrderByFieldsEnum
) {
  const { data, error } = useSWR(
    [`${process.env.listingServiceUrl}`, pageIndex, limit, filters, orderBy],
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
    if (openInFuture(listing)) {
      const date = listing.applicationOpenDate
      const openDate = dayjs(date)
      formattedDate = openDate.format("MMM D, YYYY")
      content = t("listings.applicationOpenPeriod")
    } else {
      if (listing.applicationDueDate) {
        const dueDate = dayjs(listing.applicationDueDate)
        formattedDate = dueDate.format("MMM DD, YYYY")
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mm A")

        // if due date is in future, listing is open
        if (dayjs() < dueDate) {
          content = t("listings.applicationDeadline")
        } else {
          content = t("listings.applicationsClosed")
        }
      }
      if (listing.status === ListingStatus.closed) {
        content = t("listings.applicationsClosed")
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

export async function fetchBaseListingData() {
  let listings = []
  try {
    const { id: jurisdictionId } = await fetchJurisdictionByName()
    console.log("jurisdictionId = ", jurisdictionId)
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "base",
        limit: "10",
        page: "1",
        orderBy: OrderByFieldsEnum.mostRecentlyUpdated,
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

    listings = response.data ?? []
  } catch (e) {
    console.log("fetchBaseListingData error: ", e)
  }

  return listings
}

let jurisdiction: Jurisdiction | null = null

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
  } catch (error) {
    console.log("error = ", error)
  }

  return jurisdiction
}
