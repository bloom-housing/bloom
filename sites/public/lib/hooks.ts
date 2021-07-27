import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import useSWR from "swr"
import { isInternalLink } from "@bloom-housing/ui-components"
import { ListingFilterKeys, ListingFilterParams } from "@bloom-housing/backend-core/types"
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

// TODO(abbiefarr): move this to a filters helper file
function backendFilterParamsFromFilters(filters: ListingFilterParams) {
  if (!filters) return ""
  let filterString = ""
  for (const filterKey in ListingFilterKeys) {
    const value = filters[filterKey]
    if (value && value != "") {
      filterString += `&filter[$comparison]==&filter[${filterKey}]=${value}`
    }
  }
  return filterString
}

const listingsFetcher = function () {
  return async (url: string, page: number, limit: number, filters: ListingFilterParams) => {
    const res = await axios.get(
      `${url}?page=${page}&limit=${limit}${backendFilterParamsFromFilters(filters)}`
    )
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
