import { useContext, useState } from "react"
import useSWR from "swr"

type UseApplicationsDataProps = {
  pageIndex: number
  limit: number
  listingId: string
  search?: string
  orderBy?: string
  order?: "ASC" | "DESC"
}

import { ApiClientContext } from "@bloom-housing/ui-components"

export function useSingleListingData(listingId: string) {
  const { listingsService } = useContext(ApiClientContext)
  const fetcher = () => listingsService.retrieve({ listingId })

  const { data, error } = useSWR(process.env.listingServiceUrl, fetcher)

  return {
    listingDto: data,
    listingLoading: !error && !data,
    listingError: error,
  }
}

export function useListingsData() {
  const { listingsService } = useContext(ApiClientContext)
  const fetcher = () => listingsService.list()

  const { data, error } = useSWR(process.env.listingServiceUrl, fetcher)

  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData({
  pageIndex,
  limit = 8,
  listingId,
  search = "",
  orderBy = "",
  order = "",
}: UseApplicationsDataProps) {
  const { applicationsService } = useContext(ApiClientContext)
  const endpoint = `${process.env.backendApiBase}/applications?listingId=${listingId}&page=${pageIndex}&limit=${limit}&search=${search}&orderBy=${orderBy}&order=${order}`

  const fetcher = () =>
    applicationsService.list({
      listingId,
      page: pageIndex,
      limit,
      search,
      orderBy,
      order,
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
    application: data,
    applicationLoading: !error && !data,
    applicationError: error,
  }
}

export function useListAsCsv(listingId: string, includeHeaders: boolean) {
  const [loading, setLoading] = useState(false)

  const { applicationsService } = useContext(ApiClientContext)
  const mutate = async () => {
    setLoading(true)

    try {
      const res = await applicationsService.listAsCsv({ listingId, includeHeaders })
      setLoading(false)

      return res
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return {
    mutate,
    loading,
  }
}
