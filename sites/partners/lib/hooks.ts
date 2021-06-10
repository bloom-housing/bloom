import { useContext } from "react"
import useSWR, { mutate } from "swr"

import { ApiClientContext } from "@bloom-housing/ui-components"

type UseSingleApplicationDataProps = {
  listingId: string
  page: number
  limit: number
}

export function useSingleListingData(listingId: string) {
  const { listingsService } = useContext(ApiClientContext)
  const fetcher = () => listingsService.retrieve({ listingId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings/${listingId}`, fetcher)

  return {
    listingDto: data,
    listingLoading: !error && !data,
    listingError: error,
  }
}

export function useListingsData() {
  const { listingsService } = useContext(ApiClientContext)
  const fetcher = () => listingsService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings`, fetcher)

  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData(
  pageIndex: number,
  limit = 10,
  listingId: string,
  search: string
) {
  const { applicationsService } = useContext(ApiClientContext)

  const searchParams = new URLSearchParams()
  searchParams.append("listingId", listingId)
  searchParams.append("page", pageIndex.toString())
  searchParams.append("limit", limit.toString())

  if (search) {
    searchParams.append("search", search)
  }

  const endpoint = `${process.env.backendApiBase}/applications?${searchParams.toString()}`

  const params = {
    listingId,
    page: pageIndex,
    limit,
  }

  if (search) {
    Object.assign(params, { search })
  }

  const fetcher = () => applicationsService.list(params)
  const { data, error } = useSWR(endpoint, fetcher)

  return {
    appsData: data,
    appsLoading: !error && !data,
    appsError: error,
  }
}

export function useSingleApplicationData(applicationId: string) {
  const { applicationsService } = useContext(ApiClientContext)
  const backendSingleApplicationsEndpointUrl = `${process.env.backendApiBase}/applications/${applicationId}`

  const fetcher = () => applicationsService.retrieve({ applicationId })
  const { data, error } = useSWR(backendSingleApplicationsEndpointUrl, fetcher)

  return {
    application: data,
    applicationLoading: !error && !data,
    applicationError: error,
  }
}

export function useFlaggedApplicationsList({
  listingId,
  page,
  limit,
}: UseSingleApplicationDataProps) {
  const { applicationFlaggedSetsService } = useContext(ApiClientContext)

  const searchParams = new URLSearchParams()
  searchParams.append("listingId", listingId)
  searchParams.append("page", page.toString())
  searchParams.append("limit", limit.toString())

  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets?${searchParams.toString()}`

  const fetcher = () =>
    applicationFlaggedSetsService.list({
      listingId,
      page,
      limit,
    })

  const { data, error } = useSWR(endpoint, fetcher)

  return {
    data,
    error,
  }
}

export function useSingleFlaggedApplication(afsId: string) {
  const { applicationFlaggedSetsService } = useContext(ApiClientContext)

  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets/${afsId}`
  const fetcher = () =>
    applicationFlaggedSetsService.retrieve({
      afsId,
    })

  const { data, error } = useSWR(endpoint, fetcher)

  const revalidate = () => mutate(endpoint)

  return {
    revalidate,
    data,
    error,
  }
}
