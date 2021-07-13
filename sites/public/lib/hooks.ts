import { useContext, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import { isInternalLink, AuthContext } from "@bloom-housing/ui-components"
import { AppSubmissionContext } from "./AppSubmissionContext"
import { ParsedUrlQuery } from "querystring"
import { ListingsService } from "@bloom-housing/backend-core/types"

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

const listingsFetcher = function (listingsService: ListingsService) {
  return (_url: string, page: number, limit: number) => {
    const params = {
      page,
      limit,
    }
    return listingsService?.list(params)
  }
}

// TODO: move this so it can be shared with the partner site.
export function useListingsData(pageIndex: number, limit = 10) {
  const { listingsService } = useContext(AuthContext)
  const { data, error } = useSWR(
    [`${process.env.listingServiceUrl}`, pageIndex, limit],
    listingsFetcher(listingsService)
  )

  return {
    listingsData: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}
