import { useContext, useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"
import qs from "qs"
import { useRouter } from "next/router"
import { ApplicationStatusProps, isInternalLink, t } from "@bloom-housing/ui-components"
import {
  EnumListingFilterParamsComparison,
  EnumListingFilterParamsStatus,
  Jurisdiction,
  Listing,
  ListingFilterParams,
  ListingReviewOrder,
  ListingStatus,
  OrderByFieldsEnum,
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
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mmA")

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

export async function fetchBaseListingData({
  additionalFilters,
  orderBy,
}: {
  additionalFilters?: ListingFilterParams[]
  orderBy?: OrderByFieldsEnum
}) {
  let listings = []
  try {
    const { id: jurisdictionId } = await fetchJurisdictionByName()

    if (!jurisdictionId) {
      return listings
    }
    let filter: ListingFilterParams[] = [
      {
        $comparison: EnumListingFilterParamsComparison["="],
        jurisdiction: jurisdictionId,
      },
    ]

    if (additionalFilters) {
      filter = filter.concat(additionalFilters)
    }
    const params: {
      view: string
      limit: string
      filter: ListingFilterParams[]
      orderBy?: OrderByFieldsEnum
    } = {
      view: "base",
      limit: "all",
      filter,
    }
    if (orderBy) {
      params.orderBy = orderBy
    }
    const response = await axios.get(process.env.listingServiceUrl, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })

    listings = response.data?.items
  } catch (e) {
    console.log("fetchBaseListingData error: ", e)
  }

  return listings
}

export async function fetchOpenListings() {
  return await fetchBaseListingData({
    additionalFilters: [
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.active,
      },
    ],
  })
}

export async function fetchClosedListings() {
  return await fetchBaseListingData({
    additionalFilters: [
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.closed,
      },
    ],
    orderBy: OrderByFieldsEnum.mostRecentlyClosed,
  })
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
