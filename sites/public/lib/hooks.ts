import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import useSWR from "swr"
import { isInternalLink, encodeToBackendFilterString } from "@bloom-housing/ui-components"
import { ListingFilterParams } from "@bloom-housing/backend-core/types"
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
    const res = await axios.get(
      `${url}?page=${page}&limit=${limit}${encodeToBackendFilterString(filters)}`
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
