import { useContext } from "react"
import useSWR, { mutate } from "swr"

import { AuthContext } from "@bloom-housing/ui-components"
import {
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
} from "@bloom-housing/backend-core/types"

type UseSingleApplicationDataProps = {
  listingId: string
  page: number
  limit: number
}

export function useSingleListingData(listingId: string) {
  const { listingsService } = useContext(AuthContext)
  const fetcher = () => listingsService.retrieve({ listingId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings/${listingId}`, fetcher)

  return {
    listingDto: data,
    listingLoading: !error && !data,
    listingError: error,
  }
}

/* TODO: move this function so it can be shared between public and partner sites.*/
export function useListingsData() {
  const { listingsService } = useContext(AuthContext)
  const fetcher = () => listingsService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings`, fetcher)

  return {
    listingDtos: data ? data.items : [],
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData(
  pageIndex: number,
  limit = 10,
  listingId: string,
  search: string,
  orderBy?: EnumApplicationsApiExtraModelOrderBy,
  order?: EnumApplicationsApiExtraModelOrder
) {
  const { applicationsService } = useContext(AuthContext)

  const queryParams = new URLSearchParams()
  queryParams.append("listingId", listingId)
  queryParams.append("page", pageIndex.toString())
  queryParams.append("limit", limit.toString())

  if (search) {
    queryParams.append("search", search)
  }

  if (orderBy) {
    queryParams.append("orderBy", search)
    queryParams.append("order", order ?? EnumApplicationsApiExtraModelOrder.ASC)
  }

  const endpoint = `${process.env.backendApiBase}/applications?${queryParams.toString()}`

  const params = {
    listingId,
    page: pageIndex,
    limit,
  }

  if (search) {
    Object.assign(params, { search })
  }

  if (orderBy) {
    Object.assign(params, { orderBy, order: order ?? "ASC" })
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
  const { applicationsService } = useContext(AuthContext)
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
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const queryParams = new URLSearchParams()
  queryParams.append("listingId", listingId)
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets?${queryParams.toString()}`

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
  const { applicationFlaggedSetsService } = useContext(AuthContext)

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

export function useAmiChartList() {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitPriorityList() {
  const { unitPriorityService } = useContext(AuthContext)
  const fetcher = () => unitPriorityService.list()

  const { data, error } = useSWR(
    `${process.env.backendApiBase}/unitAccessibilityPriorityTypes`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitTypeList() {
  const { unitTypesService } = useContext(AuthContext)
  const fetcher = () => unitTypesService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/unitTypes`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function usePreferenceList() {
  const { preferencesService } = useContext(AuthContext)
  const fetcher = () => preferencesService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/preferences`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}
