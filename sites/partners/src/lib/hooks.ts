import { useCallback, useContext, useState } from "react"
import useSWR from "swr"
import qs from "qs"
import dayjs from "dayjs"
import JSZip from "jszip"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
  EnumListingFilterParamsComparison,
  EnumUserFilterParamsComparison,
  MultiselectQuestion,
  UserRolesOnly,
} from "@bloom-housing/backend-core/types"
import { setSiteAlertMessage, t } from "@bloom-housing/ui-components"
import {
  EnumMultiselectQuestionFilterParamsComparison,
  ListingViews,
  MultiselectQuestionFilterParams,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
  limit: number
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
  const fetcher = () => listingId && listingsService.retrieve({ id: listingId })

  const { data, error } = useSWR(`/api/adapter/listings/${listingId}`, fetcher)

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
    view: ListingViews.base,
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

  const { data, error } = useSWR(`/api/adapter/listings?${paramsString}`, fetcher)

  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export const useListingZip = () => {
  const { listingsService } = useContext(AuthContext)

  const [zipExportLoading, setZipExportLoading] = useState(false)
  const [zipExportError, setZipExportError] = useState(false)
  const [zipCompleted, setZipCompleted] = useState(false)

  const onExport = useCallback(async () => {
    setZipExportError(false)
    setZipCompleted(false)
    setZipExportLoading(true)
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("/", "-")

    try {
      // TODO: connect to the csv endpoint when it is implemented
      // const content = await listingsService.listAsCsv({ timeZone })
      const content = { listingCsv: "", unitCsv: "" }
      const now = new Date()
      const dateString = dayjs(now).format("YYYY-MM-DD_HH-mm")
      const zip = new JSZip()
      zip.file(dateString + "_listing_data.csv", content?.listingCsv)
      zip.file(dateString + "_unit_data.csv", content?.unitCsv)
      await zip.generateAsync({ type: "blob" }).then(function (blob) {
        const fileLink = document.createElement("a")
        fileLink.setAttribute("download", `${dateString}-complete-listing-data.zip`)
        fileLink.href = URL.createObjectURL(blob)
        fileLink.click()
      })
      setZipCompleted(true)
      setSiteAlertMessage(t("t.exportSuccess"), "success")
    } catch (err) {
      setZipExportError(true)
    }
    setZipExportLoading(false)
  }, [listingsService])

  return {
    onExport,
    zipCompleted,
    zipExportLoading,
    zipExportError,
  }
}

export function useSingleApplicationData(applicationId: string) {
  const { applicationsService } = useContext(AuthContext)
  const backendSingleApplicationsEndpointUrl = `/api/adapter/applications/${applicationId}`

  const fetcher = () => applicationsService.retrieve({ applicationId: applicationId })
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
    limit,
  }

  if (view) {
    Object.assign(params, { view })
  }

  const paramString = qs.stringify(params)

  const endpoint = `/api/adapter/applicationFlaggedSets?${paramString}`

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

  const endpoint = `/api/adapter/applications?${paramsString}`

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

  const endpoint = `/api/adapter/applicationFlaggedSetsMeta?${queryParams.toString()}`

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

  const cacheKey = `/api/adapter/applicationFlaggedSets/${afsId}`

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

  const { data, error } = useSWR(`/api/adapter/amiCharts/${amiChartId}`, fetcher)

  return {
    data,
    error,
  }
}

export function useAmiChartList(jurisdiction: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.list({ jurisdictionId: jurisdiction })

  const { data, error } = useSWR(`/api/adapter/amiCharts/${jurisdiction}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useSingleAmiChart(amiChartId: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.retrieve({ amiChartId })

  const { data, error } = useSWR(`/api/adapter/amiCharts/${amiChartId}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitPriorityList() {
  const { unitPriorityService } = useContext(AuthContext)
  const fetcher = () => unitPriorityService.list()

  const { data, error } = useSWR(`/api/adapter/unitAccessibilityPriorityTypes`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitTypeList() {
  const { unitTypesService } = useContext(AuthContext)
  const fetcher = () => unitTypesService.list()

  const { data, error } = useSWR(`/api/adapter/unitTypes`, fetcher)

  const sortedData = data?.sort((a, b) => a.numBedrooms - b.numBedrooms)

  return {
    data: sortedData,
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

  const { data, error } = useSWR(`/api/adapter/jurisdictions/${jurisdictionId}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useMultiselectQuestionList() {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const fetcher = () => multiselectQuestionsService.list()

  const { data, error } = useSWR(`/api/adapter/multiselectQuestions`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useJurisdictionalMultiselectQuestionList(
  jurisdictionId: string,
  applicationSection?: MultiselectQuestionsApplicationSectionEnum
) {
  const { multiselectQuestionsService } = useContext(AuthContext)

  const params: {
    filter: MultiselectQuestionFilterParams[]
  } = {
    filter: [],
  }
  params.filter.push({
    $comparison: EnumMultiselectQuestionFilterParamsComparison["IN"],
    jurisdiction: jurisdictionId && jurisdictionId !== "" ? jurisdictionId : undefined,
  })
  if (applicationSection) {
    params.filter.push({
      $comparison: EnumMultiselectQuestionFilterParamsComparison["="],
      applicationSection,
    })
  }

  const paramsString = qs.stringify(params)

  const fetcher = () => multiselectQuestionsService.list(params)

  const cacheKey = `/api/adapter/multiselectQuestions/list?${paramsString}`

  const { data, error } = useSWR(cacheKey, fetcher)

  return {
    cacheKey,
    // TODO: remove casting when connecting partner site to new backend
    data: data as unknown as MultiselectQuestion[],
    loading: !error && !data,
    error,
  }
}

export function useListingsMultiselectQuestionList(multiselectQuestionId: string) {
  const { listingsService } = useContext(AuthContext)

  const fetcher = () =>
    listingsService.retrieveListings({
      multiselectQuestionId,
    })

  const { data, error } = useSWR(
    `/api/adapter/muliselectQuestions/listings/${multiselectQuestionId}`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useReservedCommunityTypeList() {
  const { reservedCommunityTypeService } = useContext(AuthContext)
  const fetcher = () => reservedCommunityTypeService.list()

  const { data, error } = useSWR(`/api/adapter/reservedCommunityTypes`, fetcher)

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

  const cacheKey = `/api/adapter/user/list?${paramsString}`

  const { data, error } = useSWR(cacheKey, fetcher)

  return {
    cacheKey,
    data,
    loading: !error && !data,
    error,
  }
}

export const createDateStringFromNow = (format = "YYYY-MM-DD_HH:mm:ss"): string => {
  const now = new Date()
  return dayjs(now).format(format)
}

export const useApplicationsExport = (listingId: string, includeDemographics: boolean) => {
  // const { applicationsService } = useContext(AuthContext)
  // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("/", "-")

  return useCsvExport(
    // TODO: reconnect when csv endpoint is implemented
    // () => applicationsService.listAsCsv({ listingId, timeZone, includeDemographics }),
    () => Promise.resolve(""),
    `applications-${listingId}-${createDateStringFromNow()}.csv`
  )
}

export const useUsersExport = () => {
  // const { userService } = useContext(AuthContext)

  return useCsvExport(
    // TODO: reconnect when csv endpoint is implemented
    // () => userService.listAsCsv(),
    () => Promise.resolve(""),
    `users-${createDateStringFromNow("YYYY-MM-DD_HH:mm")}.csv`
  )
}

const useCsvExport = (endpoint: () => Promise<string>, fileName: string) => {
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)
  const [csvExportSuccess, setCsvExportSuccess] = useState(false)

  const onExport = useCallback(async () => {
    setCsvExportError(false)
    setCsvExportSuccess(false)
    setCsvExportLoading(true)

    try {
      const content = await endpoint()
      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", fileName)
      fileLink.href = URL.createObjectURL(blob)
      fileLink.click()
      setCsvExportSuccess(true)
      setSiteAlertMessage(t("t.exportSuccess"), "success")
    } catch (err) {
      console.log(err)
      setCsvExportError(true)
    }

    setCsvExportLoading(false)
  }, [endpoint, fileName])

  return {
    onExport,
    csvExportLoading,
    csvExportError,
    csvExportSuccess,
  }
}
