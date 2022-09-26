import { useCallback, useContext, useState } from "react"
import useSWR from "swr"
import qs from "qs"
import dayjs from "dayjs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationSection,
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
  EnumListingFilterParamsComparison,
  EnumMultiselectQuestionsFilterParamsComparison,
  EnumUserFilterParamsComparison,
  UserRolesOnly,
} from "@bloom-housing/backend-core/types"
import { setSiteAlertMessage } from "@bloom-housing/ui-components"
export interface PaginationProps {
  page?: number
  limit: number | "all"
}

export interface ColumnOrder {
  orderBy: string
  orderDir: string
}

interface UseSingleApplicationDataProps extends PaginationProps {
  listingId: string
}

interface UseSingleFlaggedApplicationDataProps extends UseSingleApplicationDataProps {
  view?: string
}

type UseUserListProps = PaginationProps & {
  search?: string
}

type UseListingsDataProps = PaginationProps & {
  userId?: string
  search?: string
  sort?: ColumnOrder[]
  roles?: UserRolesOnly
  userJurisidctionIds?: string[]
}

export function useSingleListingData(listingId: string) {
  const { listingsService } = useContext(AuthContext)
  const fetcher = () => listingsService.retrieve({ id: listingId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings/${listingId}`, fetcher)

  return {
    listingDto: data,
    listingLoading: !error && !data,
    listingError: error,
  }
}

export function useListingsData({
  page,
  limit,
  userId,
  search = "",
  sort,
  roles,
  userJurisidctionIds,
}: UseListingsDataProps) {
  const params = {
    page,
    limit,
    filter: [],
    search,
    view: "base",
  }

  if (sort) {
    Object.assign(params, {
      orderBy: sort?.filter((item) => item.orderBy).map((item) => item.orderBy),
    })
    Object.assign(params, {
      orderDir: sort?.filter((item) => item.orderDir).map((item) => item.orderDir),
    })
  }

  // filter if logged user is an agent
  if (roles?.isPartner) {
    params.filter.push({
      $comparison: EnumListingFilterParamsComparison["="],
      leasingAgents: userId,
    })
  } else if (roles?.isJurisdictionalAdmin) {
    params.filter.push({
      $comparison: EnumListingFilterParamsComparison.IN,
      jurisdiction: userJurisidctionIds[0],
    })
  }

  if (search?.length < 3) {
    delete params.search
  } else {
    Object.assign(params, { search })
  }

  const { listingsService } = useContext(AuthContext)

  const fetcher = () => listingsService.list(params)

  const paramsString = qs.stringify(params)

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings?${paramsString}`, fetcher)

  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useSingleApplicationData(applicationId: string) {
  const { applicationsService } = useContext(AuthContext)
  const backendSingleApplicationsEndpointUrl = `${process.env.backendApiBase}/applications/${applicationId}`

  const fetcher = () => applicationsService.retrieve({ id: applicationId })
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
  view,
}: UseSingleFlaggedApplicationDataProps) {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const params = {
    listingId,
    page,
  }

  const queryParams = new URLSearchParams()
  queryParams.append("listingId", listingId)
  queryParams.append("page", page.toString())

  if (typeof limit === "number") {
    queryParams.append("limit", limit.toString())
    Object.assign(params, limit)
  }

  if (view) {
    queryParams.append("view", view)
    Object.assign(params, { view })
  }
  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets?${queryParams.toString()}`

  const fetcher = () => applicationFlaggedSetsService.list(params)

  const { data, error } = useSWR(endpoint, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useApplicationsData(
  currentPage: number,
  delayedFilterValue: string,
  limit: number,
  listingId: string,
  orderBy?: EnumApplicationsApiExtraModelOrderBy,
  order?: EnumApplicationsApiExtraModelOrder
) {
  const { applicationsService } = useContext(AuthContext)

  const params = {
    listingId,
    page: currentPage,
    limit,
  }

  if (delayedFilterValue) {
    Object.assign(params, { search: delayedFilterValue })
  }

  if (orderBy) {
    Object.assign(params, { orderBy, order: order || EnumApplicationsApiExtraModelOrder.ASC })
  }

  const paramsString = qs.stringify(params)

  const endpoint = `${process.env.backendApiBase}/applications?${paramsString}`

  const fetcher = () => applicationsService.list(params)
  const { data, error } = useSWR(endpoint, fetcher)

  const applications = data?.items
  const appsMeta = data?.meta

  return {
    applications: applications ?? [],
    appsMeta,
    appsLoading: !error && !data,
    appsError: error,
  }
}

export function useFlaggedApplicationsMeta(listingId: string) {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const params = {
    listingId,
  }

  const queryParams = new URLSearchParams()
  queryParams.append("listingId", listingId)

  const endpoint = `${
    process.env.backendApiBase
  }/applicationFlaggedSetsMeta?${queryParams.toString()}`

  const fetcher = () => applicationFlaggedSetsService.meta(params)

  const { data, error } = useSWR(endpoint, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}
export function useSingleFlaggedApplication(afsId: string) {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const fetcher = () =>
    applicationFlaggedSetsService.retrieve({
      afsId,
    })

  const cacheKey = `${process.env.backendApiBase}/applicationFlaggedSets/${afsId}`

  const { data, error } = useSWR(cacheKey, fetcher)

  return {
    cacheKey,
    data,
    error,
    loading: !error && !data,
  }
}

export function useSingleAmiChartData(amiChartId: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.retrieve({ amiChartId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${amiChartId}`, fetcher)

  return {
    data,
    error,
  }
}

export function useAmiChartList(jurisdiction: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.list({ jurisdictionId: jurisdiction })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${jurisdiction}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useSingleAmiChart(amiChartId: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.retrieve({ amiChartId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${amiChartId}`, fetcher)

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

export function useJurisdiction(jurisdictionId: string) {
  const { jurisdictionsService } = useContext(AuthContext)
  const fetcher = () =>
    jurisdictionsService.retrieve({
      jurisdictionId,
    })

  const { data, error } = useSWR(
    `${process.env.backendApiBase}/jurisdictions/${jurisdictionId}`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useMultiselectQuestionList() {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const fetcher = () => multiselectQuestionsService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/multiselectQuestions`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useJurisdictionalMultiselectQuestionList(
  jurisdictionId: string,
  applicationSection?: ApplicationSection
) {
  const { multiselectQuestionsService } = useContext(AuthContext)

  const params = {
    filter: [],
  }
  params.filter.push({
    $comparison: EnumMultiselectQuestionsFilterParamsComparison["IN"],
    jurisdiction: jurisdictionId && jurisdictionId !== "" ? jurisdictionId : undefined,
  })
  if (applicationSection) {
    params.filter.push({
      $comparison: EnumMultiselectQuestionsFilterParamsComparison["="],
      applicationSection,
    })
  }

  const paramsString = qs.stringify(params)

  const fetcher = () => multiselectQuestionsService.list(params)

  const cacheKey = `${process.env.backendApiBase}/multiselectQuestions/list?${paramsString}`

  const { data, error } = useSWR(cacheKey, fetcher)

  return {
    cacheKey,
    data,
    loading: !error && !data,
    error,
  }
}

export function useReservedCommunityTypeList() {
  const { reservedCommunityTypeService } = useContext(AuthContext)
  const fetcher = () => reservedCommunityTypeService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/reservedCommunityTypes`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUserList({ page, limit, search = "" }: UseUserListProps) {
  const params = {
    page,
    limit,
    filter: [
      {
        isPortalUser: true,
        $comparison: EnumUserFilterParamsComparison["="],
      },
    ],
    search,
  }

  if (search?.length < 3) {
    delete params.search
  } else {
    Object.assign(params, { search })
  }

  const paramsString = qs.stringify(params)

  const { userService } = useContext(AuthContext)

  const fetcher = () => userService.list(params)

  const cacheKey = `${process.env.backendApiBase}/user/list?${paramsString}`

  const { data, error } = useSWR(cacheKey, fetcher)

  return {
    cacheKey,
    data,
    loading: !error && !data,
    error,
  }
}

export const useApplicationsExport = (listingId: string, includeDemographics: boolean) => {
  const { applicationsService } = useContext(AuthContext)

  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)

  const onExport = useCallback(async () => {
    setCsvExportError(false)
    setCsvExportLoading(true)

    try {
      const content = await applicationsService.listAsCsv({
        listingId,
        includeDemographics,
      })

      const now = new Date()
      const dateString = dayjs(now).format("YYYY-MM-DD_HH:mm:ss")

      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", `applications-${listingId}-${dateString}.csv`)
      fileLink.href = URL.createObjectURL(blob)
      fileLink.click()
    } catch (err) {
      setCsvExportError(true)
      setSiteAlertMessage(err.response.data.error, "alert")
    }

    setCsvExportLoading(false)
  }, [applicationsService, includeDemographics, listingId])

  return {
    onExport,
    csvExportLoading,
    csvExportError,
  }
}
