import { useContext, useEffect, useState } from "react"
import axios from "axios"
import qs from "qs"
import { useRouter } from "next/router"
import useSWR from "swr"
import { ApplicationStatusProps, isInternalLink } from "@bloom-housing/ui-components"
import { encodeToBackendFilterArray, ListingFilterState } from "@bloom-housing/shared-helpers"
import {
  Listing,
  OrderByFieldsEnum,
  EnumListingFilterParamsComparison,
  EnumListingFilterParamsStatus,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { AppSubmissionContext } from "./applications/AppSubmissionContext"
import { getListingApplicationStatus } from "./helpers"

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

const listingsFetcher = function (view: string) {
  return async (
    url: string,
    page: number,
    limit: number,
    filters: ListingFilterState,
    orderBy: OrderByFieldsEnum
  ) => {
    const res = await axios.get(url, {
      params: {
        view,
        page,
        limit,
        filter: encodeToBackendFilterArray(filters),
        orderBy,
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
  limit = 8,
  filters: ListingFilterState,
  orderBy: OrderByFieldsEnum,
  view = "publicListings"
) {
  const { data, error } = useSWR(
    [`${process.env.listingServiceUrl}`, pageIndex, limit, filters, orderBy],
    listingsFetcher(view)
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

    const { content, subContent } = getListingApplicationStatus(listing)

    setProps({ content, subContent })
  }, [listing])

  return props
}

export async function fetchBaseListingData() {
  let listings = []
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "publicListings",
        limit: 8,
        page: 1,
        orderBy: OrderByFieldsEnum.comingSoon,
        filter: [
          {
            $comparison: EnumListingFilterParamsComparison["="],
            status: EnumListingFilterParamsStatus.active,
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
