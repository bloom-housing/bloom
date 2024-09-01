import { useContext, useEffect, useState } from "react"
import axios from "axios"
//import qs from "qs"
import { useRouter } from "next/router"
import { ApplicationStatusProps } from "@bloom-housing/ui-components"
import {
  // EnumListingFilterParamsComparison,
  Jurisdiction,
  Listing,
  // ListingFilterParams,
  // ListingOrderByKeys,
  // ListingsStatusEnum,
  // OrderByEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ParsedUrlQuery } from "querystring"
import { AppSubmissionContext } from "./applications/AppSubmissionContext"
import { getListingApplicationStatus } from "./helpers"
import { useRequireLoggedInUser, isInternalLink } from "@bloom-housing/shared-helpers"

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
  useRequireLoggedInUser("/", !process.env.showMandatedAccounts || conductor.config?.isPreview)

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

    const { content, subContent } = getListingApplicationStatus(listing)

    setProps({ content, subContent })
  }, [listing])

  return props
}

// These functions were sparsely used and/or completely ignored, so I'm commenting
// them out.  If it turns out they are needed later then it should be easy to add
// them back by uncommenting, but make sure the logic still matches expectations.
/*
export async function fetchBaseListingData({
  additionalFilters,
  orderBy,
  orderDir,
  limit,
}: {
  additionalFilters?: ListingFilterParams[]
  orderBy?: ListingOrderByKeys[]
  orderDir?: OrderByEnum[]
  limit?: string
}) {
  let listings = []
  try {
    let filter: ListingFilterParams[] = []

    if (additionalFilters) {
      filter = filter.concat(additionalFilters)
    }
    const params: {
      view: string
      limit: string
      filter: ListingFilterParams[]
      orderBy?: ListingOrderByKeys[]
      orderDir?: OrderByEnum[]
    } = {
      view: "base",
      limit: limit || "all",
      filter,
    }
    if (orderBy) {
      params.orderBy = orderBy
    }
    if (orderDir) {
      params.orderDir = orderDir
    }

    const response = await axios.get(getListingServiceUrl(), {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
      headers: {
        passkey: process.env.API_PASS_KEY,
        "x-forwarded-for": req.headers["x-forwarded-for"] ?? req.socket.remoteAddress,
      },
    })

    listings = response.data?.items
  } catch (e) {
    console.log("fetchBaseListingData error: ", e)
  }

  return listings
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchOpenListings(req: any) {
  return await fetchBaseListingData(
    {
      additionalFilters: [
        {
          $comparison: EnumListingFilterParamsComparison["="],
          status: ListingsStatusEnum.active,
        },
      ],
      orderBy: [ListingOrderByKeys.mostRecentlyPublished],
      orderDir: [OrderByEnum.desc],
    },
    req
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchClosedListings(req: any) {
  return await fetchBaseListingData(
    {
      additionalFilters: [
        {
          $comparison: EnumListingFilterParamsComparison["="],
          status: ListingsStatusEnum.closed,
        },
      ],
      orderBy: [ListingOrderByKeys.mostRecentlyClosed],
      orderDir: [OrderByEnum.desc],
      limit: "10",
    },
    req
  )
}
*/

let jurisdiction: Jurisdiction | null = null

export async function fetchJurisdictionByName(
  backendApiBase: string,
  jurisdictionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
) {
  try {
    if (jurisdiction) {
      return jurisdiction
    }

    const headers: Record<string, string> = {
      "x-forwarded-for": req.headers["x-forwarded-for"] ?? req.socket.remoteAddress,
    }

    if (process.env.API_PASS_KEY) {
      headers.passkey = process.env.API_PASS_KEY
    }

    const jurisdictionRes = await axios.get(
      `${backendApiBase}/jurisdictions/byName/${jurisdictionName}`,
      {
        headers,
      }
    )
    jurisdiction = jurisdictionRes?.data
  } catch (error) {
    console.log("error = ", error)
  }

  return jurisdiction
}
