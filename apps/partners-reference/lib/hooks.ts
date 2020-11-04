import { useContext } from "react"
import useSWR from "swr"

import { ApiClientContext } from "@bloom-housing/ui-components"

export function useListingsData() {
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(process.env.listingServiceUrl, fetcher)
  if (data && data.status == "ok") {
    console.log(data)
    console.log(`Listings Data Received: ${data.listings}`)
  }
  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData(pageIndex: number, limit = 10, listingId: string, search = "") {
  const { applicationsService } = useContext(ApiClientContext)
  const endpoint = `${process.env.backendApiBase}/applications?listingId=${listingId}&page=${pageIndex}&limit=${limit}&search=${search}`
  const fetcher = () =>
    applicationsService.list({
      listingId,
      page: pageIndex,
      limit,
      search,
    })
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
    applicationDto: data,
    applicationLoading: !error && !data,
    applicationError: error,
  }
}
