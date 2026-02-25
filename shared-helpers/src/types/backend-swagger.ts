/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from "axios"

export interface IRequestOptions extends AxiosRequestConfig {
  /** only in axios interceptor config*/
  loading?: boolean
  showError?: boolean
}

export interface IRequestConfig {
  method?: any
  headers?: any
  url?: any
  data?: any
  params?: any
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance
  /** only in axios interceptor config*/
  loading: boolean
  showError: boolean
}

// Add default options
export const serviceOptions: ServiceOptions = {}

// Instance selector
export function axios(
  configs: IRequestConfig,
  resolve: (p: any) => void,
  reject: (p: any) => void
): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  } else {
    throw new Error("please inject yourself instance like axios  ")
  }
}

export function getConfigs(
  method: string,
  contentType: string,
  url: string,
  options: any
): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url,
  }
  configs.headers = {
    ...options.headers,
    "Content-Type": contentType,
  }
  return configs
}

export const basePath = ""

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[]
}

export class ListResult<T> implements IListResult<T> {
  items?: T[]
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number
  items?: T[]
}

export class PagedResult<T = any> implements IPagedResult<T> {
  totalCount?: number
  items?: T[]
}

// customer definition
// empty

export class RootService {
  /**
   * Health check endpoint
   */
  healthCheck(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Tip me over and pour me out
   */
  teapot(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/teapot"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the removal of CSVs job
   */
  clearTempFiles(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/clearTempFiles"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class ListingsService {
  /**
   * Get a paginated set of listings
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: ListingFilterParams[]
      /**  */
      view?: ListingViews
      /**  */
      orderBy?: ListingOrderByKeys[]
      /**  */
      orderDir?: OrderByEnum[]
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedListing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        filter: params["filter"],
        view: params["view"],
        orderBy: params["orderBy"],
        orderDir: params["orderDir"],
        search: params["search"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create listing
   */
  create(
    params: {
      /** requestBody */
      body?: ListingCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete listing by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a paginated set of listings
   */
  filterableList(
    params: {
      /** requestBody */
      body?: ListingsQueryBody
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedListing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/list"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listings and units as zip
   */
  listAsCsv(
    params: {
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/csv"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { timeZone: params["timeZone"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listing map markers
   */
  mapMarkers(options: IRequestOptions = {}): Promise<ListingMapMarker[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/mapMarkers"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listing for external consumption by id
   */
  externalRetrieve(
    params: {
      /**  */
      id: string
      /**  */
      view?: ListingViews
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/external/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { view: params["view"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Duplicate listing
   */
  duplicate(
    params: {
      /** requestBody */
      body?: ListingDuplicate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/duplicate"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the listing process job
   */
  process(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/closeListings"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update listing by id
   */
  update(
    params: {
      /**  */
      id: string
      /** requestBody */
      body?: ListingUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listing by id
   */
  retrieve(
    params: {
      /**  */
      id: string
      /**  */
      view?: ListingViews
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { view: params["view"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listings by multiselect question id
   */
  retrieveListings(
    params: {
      /**  */
      multiselectQuestionId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<IdDTO[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/byMultiselectQuestion/{multiselectQuestionId}"
      url = url.replace("{multiselectQuestionId}", params["multiselectQuestionId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listings by assigned property ID
   */
  retrieveListingsByProperty(
    params: {
      /**  */
      propertyId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<IdDTO[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/byProperty/{propertyId}"
      url = url.replace("{propertyId}", params["propertyId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class ApplicationFlaggedSetsService {
  /**
   * List application flagged sets
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      listingId: string
      /**  */
      view?: AfsView
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedAfs> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        view: params["view"],
        search: params["search"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Meta information for application flagged sets
   */
  meta(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      listingId: string
      /**  */
      view?: AfsView
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AfsMeta> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/meta"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        view: params["view"],
        search: params["search"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Retrieve application flagged set by id
   */
  retrieve(
    params: {
      /**  */
      afsId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/{afsId}"
      url = url.replace("{afsId}", params["afsId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Resolve application flagged set
   */
  resolve(
    params: {
      /** requestBody */
      body?: AfsResolve
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/resolve"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the duplicate check process
   */
  processDuplicates(
    params: {
      /**  */
      listingId?: string
      /**  */
      force?: boolean
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/process_duplicates"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)
      configs.params = { listingId: params["listingId"], force: params["force"] }

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Reset flagged set confirmation alert
   */
  resetConfirmationAlert(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/{id}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class MultiselectQuestionsService {
  /**
   * List multiselect questions
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: MultiselectQuestionFilterParams[]
      /**  */
      orderBy?: MultiselectQuestionOrderByKeys[]
      /**  */
      orderDir?: OrderByEnum[]
      /**  */
      search?: string
      /**  */
      view?: MultiselectQuestionViews
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedMultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        filter: params["filter"],
        orderBy: params["orderBy"],
        orderDir: params["orderDir"],
        search: params["search"],
        view: params["view"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create multiselect question
   */
  create(
    params: {
      /** requestBody */
      body?: MultiselectQuestionCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update multiselect question
   */
  update(
    params: {
      /** requestBody */
      body?: MultiselectQuestionUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete multiselect question by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Re-activate a multiselect question
   */
  reActivate(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/reActivate"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Retire a multiselect question
   */
  retire(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/retire"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the retirement of multiselect questions cron job
   */
  retireMultiselectQuestions(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/retireMultiselectQuestions"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get multiselect question by id
   */
  retrieve(
    params: {
      /**  */
      multiselectQuestionId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/{multiselectQuestionId}"
      url = url.replace("{multiselectQuestionId}", params["multiselectQuestionId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class SnapshotService {
  /**
   * Create User Snapshot
   */
  createUserSnapshot(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/snapshot/createUserSnapshot"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class AmiChartsService {
  /**
   * List amiCharts
   */
  list(
    params: {
      /**  */
      jurisdictionId?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { jurisdictionId: params["jurisdictionId"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create amiChart
   */
  create(
    params: {
      /** requestBody */
      body?: AmiChartCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete amiChart by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get amiChart by id
   */
  retrieve(
    params: {
      /**  */
      amiChartId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts/{amiChartId}"
      url = url.replace("{amiChartId}", params["amiChartId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update amiChart
   */
  update(
    params: {
      /** requestBody */
      body?: AmiChartUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts/{amiChartId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class ReservedCommunityTypesService {
  /**
   * List reservedCommunityTypes
   */
  list(
    params: {
      /**  */
      jurisdictionId?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { jurisdictionId: params["jurisdictionId"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create reservedCommunityType
   */
  create(
    params: {
      /** requestBody */
      body?: ReservedCommunityTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete reservedCommunityType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get reservedCommunityType by id
   */
  retrieve(
    params: {
      /**  */
      reservedCommunityTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes/{reservedCommunityTypeId}"
      url = url.replace("{reservedCommunityTypeId}", params["reservedCommunityTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update reservedCommunityType
   */
  update(
    params: {
      /** requestBody */
      body?: ReservedCommunityTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes/{reservedCommunityTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class UnitTypesService {
  /**
   * List unitTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unitType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unitType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unitType by id
   */
  retrieve(
    params: {
      /**  */
      unitTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes/{unitTypeId}"
      url = url.replace("{unitTypeId}", params["unitTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unitType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes/{unitTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class UnitRentTypesService {
  /**
   * List unitRentTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitRentType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unitRentType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitRentTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unitRentType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unitRentType by id
   */
  retrieve(
    params: {
      /**  */
      unitRentTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes/{unitRentTypeId}"
      url = url.replace("{unitRentTypeId}", params["unitRentTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unitRentType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitRentTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes/{unitRentTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class JurisdictionsService {
  /**
   * List jurisdictions
   */
  list(options: IRequestOptions = {}): Promise<Jurisdiction[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create jurisdiction
   */
  create(
    params: {
      /** requestBody */
      body?: JurisdictionCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete jurisdiction by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get jurisdiction by id
   */
  retrieve(
    params: {
      /**  */
      jurisdictionId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/{jurisdictionId}"
      url = url.replace("{jurisdictionId}", params["jurisdictionId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update jurisdiction
   */
  update(
    params: {
      /** requestBody */
      body?: JurisdictionUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/{jurisdictionId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get jurisdiction by name
   */
  retrieveByName(
    params: {
      /**  */
      jurisdictionName: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/byName/{jurisdictionName}"
      url = url.replace("{jurisdictionName}", params["jurisdictionName"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class ApplicationsService {
  /**
   * Get a paginated set of applications
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      listingId?: string
      /**  */
      search?: string
      /**  */
      userId?: string
      /**  */
      orderBy?: ApplicationOrderByKeys
      /**  */
      order?: OrderByEnum
      /**  */
      markedAsDuplicate?: boolean
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        search: params["search"],
        userId: params["userId"],
        orderBy: params["orderBy"],
        order: params["order"],
        markedAsDuplicate: params["markedAsDuplicate"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create application (used by partners to hand create an application)
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete application by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get the most recent application submitted by the user
   */
  mostRecentlyCreated(
    params: {
      /**  */
      userId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/mostRecentlyCreated"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { userId: params["userId"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get public applications info
   */
  publicAppsView(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
      /**  */
      userId: string
      /**  */
      filterType?: ApplicationsFilterEnum
      /**  */
      includeLotteryApps?: boolean
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PublicAppsViewResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/publicAppsView"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        userId: params["userId"],
        filterType: params["filterType"],
        includeLotteryApps: params["includeLotteryApps"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications as csv
   */
  listAsCsv(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/csv"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications as spreadsheet
   */
  listAsSpreadsheet(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/spreadsheet"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications as csv
   */
  listAsCsvSecure(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/csvSecure"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications as spreadsheet
   */
  listAsSpreadsheetSecure(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/spreadsheetSecure"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get application by id
   */
  retrieve(
    params: {
      /**  */
      applicationId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/{applicationId}"
      url = url.replace("{applicationId}", params["applicationId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Submit application (used by applicants applying to a listing)
   */
  submit(
    params: {
      /** requestBody */
      body?: ApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/submit"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Verify application can be saved
   */
  submissionValidation(
    params: {
      /** requestBody */
      body?: ApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/verify"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * trigger the remove PII cron job
   */
  removePiiCronJob(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/removePIICronJob"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update application by id
   */
  update(
    params: {
      /**  */
      id: string
      /** requestBody */
      body?: ApplicationUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Send application update email by id
   */
  notifyUpdate(
    params: {
      /**  */
      id: string
      /** requestBody */
      body?: ApplicationUpdateEmail
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/{id}/notify-update"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class AssetsService {
  /**
   * Create presigned upload metadata
   */
  createPresignedUploadMetadata(
    params: {
      /** requestBody */
      body?: CreatePresignedUploadMetadata
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/assets/presigned-upload-metadata"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class UserService {
  /**
   * Get a user from cookies
   */
  profile(options: IRequestOptions = {}): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete user by id
   */
  delete(
    params: {
      /** requestBody */
      body?: UserDeleteDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a paginated set of users
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: UserFilterParams[]
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedUser> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/list"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        filter: params["filter"],
        search: params["search"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * List users in CSV
   */
  listAsCsv(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/csv"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get the ids of the user favorites
   */
  favoriteListings(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<IdDTO[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/favoriteListings/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Creates a public only user
   */
  createPublic(
    params: {
      /**  */
      noWelcomeEmail?: boolean
      /** requestBody */
      body?: PublicUserCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/public"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)
      configs.params = { noWelcomeEmail: params["noWelcomeEmail"] }

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update user
   */
  updatePublic(
    params: {
      /** requestBody */
      body?: PublicUserUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/public"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Creates a partner only user
   */
  createPartner(
    params: {
      /** requestBody */
      body?: PartnerUserCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/partner"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update user
   */
  updatePartner(
    params: {
      /** requestBody */
      body?: PartnerUserUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/partner"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Creates a advocate only user
   */
  createAdvocate(
    params: {
      /**  */
      noWelcomeEmail?: boolean
      /** requestBody */
      body?: AdvocateUserCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/advocate"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)
      configs.params = { noWelcomeEmail: params["noWelcomeEmail"] }

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update user
   */
  updateAdvocate(
    params: {
      /** requestBody */
      body?: AdvocateUserUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/advocate"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Request single use code
   */
  requestSingleUseCode(
    params: {
      /** requestBody */
      body?: RequestSingleUseCode
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/request-single-use-code"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Resend public confirmation
   */
  resendConfirmation(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/resend-confirmation"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Resend partner confirmation
   */
  resendPartnerConfirmation(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/resend-partner-confirmation"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Verifies token is valid
   */
  isUserConfirmationTokenValid(
    params: {
      /** requestBody */
      body?: ConfirmationRequest
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/is-confirmation-token-valid"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Forgot Password
   */
  forgotPassword(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/forgot-password"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Add or remove a listing from user favorites
   */
  modifyFavoriteListings(
    params: {
      /** requestBody */
      body?: UserFavoriteListing
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserFavoriteListing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/modifyFavoriteListings"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * trigger the user warn of deletion cron job
   */
  userWarnCronJob(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/userWarnCronJob"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * trigger the delete inactive users cron job
   */
  deleteInactiveUsersCronJob(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/deleteInactiveUsersCronJob"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get user by id
   */
  retrieve(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class AuthService {
  /**
   * Login
   */
  login(
    params: {
      /** requestBody */
      body?: Login
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/login"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * LoginViaSingleUseCode
   */
  loginViaASingleUseCode(
    params: {
      /** requestBody */
      body?: LoginViaSingleUseCode
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/loginViaSingleUseCode"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Logout
   */
  logout(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/logout"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Request mfa code
   */
  requestMfaCode(
    params: {
      /** requestBody */
      body?: RequestMfaCode
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<RequestMfaCodeResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/request-mfa-code"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Requests a new token given a refresh token
   */
  requestNewToken(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/requestNewToken"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update Password
   */
  updatePassword(
    params: {
      /** requestBody */
      body?: UpdatePassword
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/update-password"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Confirm email
   */
  confirm(
    params: {
      /** requestBody */
      body?: Confirm
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/confirm"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class MapLayersService {
  /**
   * List map layers
   */
  list(
    params: {
      /**  */
      jurisdictionId?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MapLayer[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/mapLayers"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { jurisdictionId: params["jurisdictionId"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class ScriptRunnerService {
  /**
   * An example of how the script runner can work
   */
  exampleScript(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/exampleScript"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that resends application confirmations to applicants of a listing
   */
  bulkApplicationResend(
    params: {
      /** requestBody */
      body?: BulkApplicationResendDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/bulkApplicationResend"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that takes in a standardized string and outputs the input for the ami chart create endpoint
   */
  amiChartImport(
    params: {
      /** requestBody */
      body?: AmiChartImportDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/amiChartImport"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that takes in a standardized string and outputs the input for the ami chart update endpoint
   */
  amiChartUpdateImport(
    params: {
      /** requestBody */
      body?: AmiChartUpdateImportDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/amiChartUpdateImport"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that adds lottery translations to the db
   */
  lotteryTranslations(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/lotteryTranslations"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that adds lottery translations to the db and creates them if it does not exist
   */
  lotteryTranslations1(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/lotteryTranslationsCreateIfEmpty"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that opts out existing lottery listings
   */
  optOutExistingLotteries(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/optOutExistingLotteries"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that creates a new reserved community type
   */
  createNewReservedCommunityType(
    params: {
      /** requestBody */
      body?: CommunityTypeDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/createNewReservedCommunityType"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that updates single use code translations to show extended expiration time
   */
  updateCodeExpirationTranslations(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/updateCodeExpirationTranslations"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that hides program multiselect questions from the public detail page
   */
  hideProgramsFromListings(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/hideProgramsFromListings"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that updates the "what happens next" content in lottery email
   */
  updatesWhatHappensInLotteryEmail(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/updatesWhatHappensInLotteryEmail"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that adds existing feature flags into the feature flag table
   */
  addFeatureFlags(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/addFeatureFlags"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that moves preferences and programs to multiselect questions in Detroit db
   */
  migrateDetroitToMultiselectQuestions(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/migrateDetroitToMultiselectQuestions"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script to migrate MSQ data and options to refactored schema
   */
  migrateMultiselectDataToRefactor(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/migrateMultiselectDataToRefactor"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script to migrate application MSQ selections to refactored schema
   */
  migrateMultiselectApplicationDataToRefactor(
    params: {
      /** requestBody */
      body?: PaginationDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/migrateMultiselectApplicationDataToRefactor"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that sets the initial values for expire_after on applications
   */
  setInitialExpireAfterValues(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/setInitialExpireAfterValues"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * A script that sets is_newest field on application if newest application for applicant
   */
  setIsNewestApplicationValues(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/scriptRunner/setIsNewestApplicationValues"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class FeatureFlagsService {
  /**
   * List of feature flags
   */
  list(options: IRequestOptions = {}): Promise<FeatureFlag[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Create a feature flag
   */
  create(
    params: {
      /** requestBody */
      body?: FeatureFlagCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FeatureFlag> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update a feature flag
   */
  update(
    params: {
      /** requestBody */
      body?: FeatureFlagUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FeatureFlag> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete a feature flag by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Associate and disassociate jurisdictions with a feature flag
   */
  associateJurisdictions(
    params: {
      /** requestBody */
      body?: FeatureFlagAssociate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FeatureFlag> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags/associateJurisdictions"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Add all new feature flags
   */
  addAllNewFeatureFlags(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags/addAllNew"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a feature flag by id
   */
  retrieve(
    params: {
      /**  */
      featureFlagId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FeatureFlag> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/featureFlags/{featureFlagId}"
      url = url.replace("{featureFlagId}", params["featureFlagId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class LotteryService {
  /**
   * Generate the lottery results for a listing
   */
  lotteryGenerate(
    params: {
      /** requestBody */
      body?: ApplicationCsvQueryParams
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/generateLotteryResults"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications lottery results
   */
  lotteryResults(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/getLotteryResults"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applications lottery results
   */
  lotteryResultsSecure(
    params: {
      /**  */
      id: string
      /**  */
      includeDemographics?: boolean
      /**  */
      timeZone?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/getLotteryResultsSecure"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        id: params["id"],
        includeDemographics: params["includeDemographics"],
        timeZone: params["timeZone"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Change the listing lottery status
   */
  lotteryStatus(
    params: {
      /** requestBody */
      body?: ListingLotteryStatus
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/lotteryStatus"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a lottery activity log
   */
  lotteryActivityLog(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LotteryActivityLogItem[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/lotteryActivityLog/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the lottery auto publish process job
   */
  autoPublishResults(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/autoPublishResults"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the lottery expiration process job
   */
  expireLotteries(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/expireLotteries"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = null

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get lottery results by application id
   */
  publicLotteryResults(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PublicLotteryResult[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/publicLotteryResults/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get lottery totals by listing id
   */
  lotteryTotals(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PublicLotteryTotal[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/lottery/lotteryTotals/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export class PropertiesService {
  /**
   * Get a paginated set of properties
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      search?: string
      /**  */
      filter?: PropertyFilterParams[]
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedProperty> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        search: params["search"],
        filter: params["filter"],
      }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Add a new property entry
   */
  add(
    params: {
      /** requestBody */
      body?: PropertyCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Update an exiting property entry by id
   */
  update(
    params: {
      /** requestBody */
      body?: PropertyUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete an property entry by ID
   */
  deleteById(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a property object by ID
   */
  getById(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a paginated filtered set of properties
   */
  filterableList(
    params: {
      /** requestBody */
      body?: PropertyQueryParams
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedProperty> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/properties/list"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class AgencyService {
  /**
   * Get a paginated set of agencies
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: AgencyFilterParams[]
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedAgency> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/agency"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { page: params["page"], limit: params["limit"], filter: params["filter"] }

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
  /**
   * Creates a new agency entry in the database
   */
  create(
    params: {
      /** requestBody */
      body?: AgencyCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Agency> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/agency"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Updates an existing agency entry in the database
   */
  update(
    params: {
      /** requestBody */
      body?: AgencyUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Agency> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/agency"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Deletes an agency entry from the database by its ID
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/agency"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
  /**
   * Get a single agency by its ID
   */
  getById(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Agency> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/agency/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject)
    })
  }
}

export interface SuccessDTO {
  /**  */
  success: boolean
}

export interface ListingFilterParams {
  /**  */
  $comparison: EnumListingFilterParamsComparison

  /**  */
  availabilities?: FilterAvailabilityEnum[]

  /**  */
  availability?: FilterAvailabilityEnum

  /**  */
  bathrooms?: number

  /**  */
  bedrooms?: number

  /**  */
  bedroomTypes?: []

  /**  */
  city?: string

  /**  */
  counties?: string[]

  /**  */
  homeTypes?: HomeTypeEnum[]

  /**  */
  ids?: string[]

  /**  */
  isVerified?: boolean

  /**  */
  jurisdiction?: string

  /**  */
  leasingAgent?: string

  /**  */
  listingFeatures?: string[]

  /**  */
  monthlyRent?: number

  /**  */
  multiselectQuestions?: string[]

  /**  */
  name?: string

  /**  */
  neighborhood?: string

  /**  */
  regions?: RegionEnum[]

  /**  */
  configurableRegions?: []

  /**  */
  reservedCommunityTypes?: string[]

  /**  */
  section8Acceptance?: boolean

  /**  */
  status?: ListingsStatusEnum

  /**  */
  zipCode?: string

  /**  */
  listingType?: ListingTypeEnum

  /**  */
  parkingType?: ParkingTypeEnum
}

export interface ListingsQueryBody {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"

  /**  */
  filter?: ListingFilterParams[]

  /**  */
  view?: ListingViews

  /**  */
  orderBy?: ListingOrderByKeys[]

  /**  */
  orderDir?: OrderByEnum[]

  /**  */
  search?: string
}

export interface ListingsQueryParams {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"

  /**  */
  filter?: string[]

  /**  */
  view?: ListingViews

  /**  */
  orderBy?: ListingOrderByKeys[]

  /**  */
  orderDir?: OrderByEnum[]

  /**  */
  search?: string
}

export interface ListingFilterKeyDTO {
  /**  */
  value?: ListingFilterKeys
}

export interface ListingsRetrieveParams {
  /**  */
  view?: ListingViews
}

export interface PaginationAllowsAllQueryParams {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"
}

export interface IdDTO {
  /**  */
  id: string

  /**  */
  name?: string

  /**  */
  ordinal?: number
}

export interface ListingParkingType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  onStreet?: boolean

  /**  */
  offStreet?: boolean

  /**  */
  garage?: boolean

  /**  */
  carport?: boolean
}

export interface ListingDocuments {
  /**  */
  socialSecurityCard?: boolean

  /**  */
  currentLandlordReference?: boolean

  /**  */
  birthCertificate?: boolean

  /**  */
  previousLandlordReference?: boolean

  /**  */
  governmentIssuedId?: boolean

  /**  */
  proofOfAssets?: boolean

  /**  */
  proofOfIncome?: boolean

  /**  */
  residencyDocuments?: boolean

  /**  */
  proofOfCustody?: boolean
}

export interface MultiselectLink {
  /**  */
  title: string

  /**  */
  url: string
}

export interface MultiselectOption {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  collectAddress?: boolean

  /**  */
  collectName?: boolean

  /**  */
  collectRelationship?: boolean

  /**  */
  description?: string

  /**  */
  exclusive?: boolean

  /**  */
  isOptOut?: boolean

  /**  */
  links?: MultiselectLink[]

  /**  */
  mapLayerId?: string

  /**  */
  mapPinPosition?: string

  /**  */
  multiselectQuestion?: IdDTO

  /**  */
  name?: string

  /**  */
  ordinal: number

  /**  */
  radiusSize?: number

  /**  */
  shouldCollectAddress?: boolean

  /**  */
  shouldCollectName?: boolean

  /**  */
  shouldCollectRelationship?: boolean

  /**  */
  text: string

  /**  */
  untranslatedName?: string

  /**  */
  untranslatedText?: string

  /**  */
  validationMethod?: ValidationMethodEnum
}

export interface MultiselectQuestion {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum

  /**  */
  description?: string

  /**  */
  isExclusive?: boolean

  /**  */
  hideFromListing?: boolean

  /**  */
  jurisdiction?: IdDTO

  /**  */
  jurisdictions: IdDTO[]

  /**  */
  links?: MultiselectLink[]

  /**  */
  multiselectOptions?: MultiselectOption[]

  /**  */
  name?: string

  /**  */
  options?: MultiselectOption[]

  /**  */
  optOutText?: string

  /**  */
  status: MultiselectQuestionsStatusEnum

  /**  */
  subText?: string

  /**  */
  text: string

  /**  */
  untranslatedName?: string

  /**  */
  untranslatedText?: string

  /**  */
  untranslatedOptOutText?: string
}

export interface ListingMultiselectQuestion {
  /**  */
  multiselectQuestions: MultiselectQuestion

  /**  */
  ordinal?: number
}

export interface Asset {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  fileId: string

  /**  */
  label: string
}

export interface PaperApplication {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  language: LanguagesEnum

  /**  */
  assets: Asset
}

export interface ApplicationMethod {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  type: ApplicationMethodsTypeEnum

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  paperApplications?: PaperApplication[]
}

export interface ListingEvent {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  type: ListingEventsTypeEnum

  /**  */
  startDate?: Date

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string

  /**  */
  assets?: Asset
}

export interface Address {
  /**  */
  id: string

  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number
}

export interface ListingImage {
  /**  */
  assets: Asset

  /**  */
  ordinal?: number

  /**  */
  description?: string
}

export interface ListingFeatures {
  /**  */
  id: string

  /**  */
  accessibleHeightToilet?: boolean

  /**  */
  accessibleParking?: boolean

  /**  */
  acInUnit?: boolean

  /**  */
  barrierFreeBathroom?: boolean

  /**  */
  barrierFreeEntrance?: boolean

  /**  */
  barrierFreePropertyEntrance?: boolean

  /**  */
  barrierFreeUnitEntrance?: boolean

  /**  */
  bathGrabBarsOrReinforcements?: boolean

  /**  */
  bathroomCounterLowered?: boolean

  /**  */
  brailleSignageInBuilding?: boolean

  /**  */
  carbonMonoxideDetectorWithStrobe?: boolean

  /**  */
  carpetInUnit?: boolean

  /**  */
  elevator?: boolean

  /**  */
  extraAudibleCarbonMonoxideDetector?: boolean

  /**  */
  extraAudibleSmokeDetector?: boolean

  /**  */
  fireSuppressionSprinklerSystem?: boolean

  /**  */
  frontControlsDishwasher?: boolean

  /**  */
  frontControlsStoveCookTop?: boolean

  /**  */
  grabBars?: boolean

  /**  */
  hardFlooringInUnit?: boolean

  /**  */
  hearing?: boolean

  /**  */
  hearingAndVision?: boolean

  /**  */
  heatingInUnit?: boolean

  /**  */
  inUnitWasherDryer?: boolean

  /**  */
  kitchenCounterLowered?: boolean

  /**  */
  laundryInBuilding?: boolean

  /**  */
  leverHandlesOnDoors?: boolean

  /**  */
  leverHandlesOnFaucets?: boolean

  /**  */
  loweredCabinets?: boolean

  /**  */
  loweredLightSwitch?: boolean

  /**  */
  mobility?: boolean

  /**  */
  noEntryStairs?: boolean

  /**  */
  nonDigitalKitchenAppliances?: boolean

  /**  */
  noStairsToParkingSpots?: boolean

  /**  */
  noStairsWithinUnit?: boolean

  /**  */
  parkingOnSite?: boolean

  /**  */
  refrigeratorWithBottomDoorFreezer?: boolean

  /**  */
  rollInShower?: boolean

  /**  */
  serviceAnimalsAllowed?: boolean

  /**  */
  smokeDetectorWithStrobe?: boolean

  /**  */
  streetLevelEntrance?: boolean

  /**  */
  toiletGrabBarsOrReinforcements?: boolean

  /**  */
  ttyAmplifiedPhone?: boolean

  /**  */
  turningCircleInBathrooms?: boolean

  /**  */
  visual?: boolean

  /**  */
  walkInShower?: boolean

  /**  */
  wheelchairRamp?: boolean

  /**  */
  wideDoorways?: boolean
}

export interface ListingUtilities {
  /**  */
  id: string

  /**  */
  water?: boolean

  /**  */
  gas?: boolean

  /**  */
  trash?: boolean

  /**  */
  sewer?: boolean

  /**  */
  electricity?: boolean

  /**  */
  cable?: boolean

  /**  */
  phone?: boolean

  /**  */
  internet?: boolean
}

export interface AmiChartItem {
  /**  */
  percentOfAmi: number

  /**  */
  householdSize: number

  /**  */
  income: number
}

export interface AmiChart {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  items: AmiChartItem[]

  /**  */
  name: string

  /**  */
  jurisdictions: IdDTO
}

export interface UnitType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: UnitTypeEnum

  /**  */
  numBedrooms: number
}

export interface UnitRentType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: UnitRentTypeEnum
}

export interface UnitAmiChartOverride {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  items: AmiChartItem[]
}

export interface Unit {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  amiChart?: AmiChart

  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean

  /**  */
  unitTypes?: UnitType

  /**  */
  unitRentTypes?: UnitRentType

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitAmiChartOverrides?: UnitAmiChartOverride
}

export interface UnitGroupAmiLevel {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  amiPercentage?: number

  /**  */
  monthlyRentDeterminationType?: EnumUnitGroupAmiLevelMonthlyRentDeterminationType

  /**  */
  percentageOfIncomeValue?: number

  /**  */
  flatRentValue?: number

  /**  */
  amiChart?: AmiChart
}

export interface UnitGroup {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  flatRentValueFrom?: number

  /**  */
  flatRentValueTo?: number

  /**  */
  monthlyRent?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  bathroomMin?: number

  /**  */
  bathroomMax?: number

  /**  */
  openWaitlist?: boolean

  /**  */
  sqFeetMin?: number

  /**  */
  sqFeetMax?: number

  /**  */
  rentType?: RentTypeEnum

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitGroupAmiLevels?: UnitGroupAmiLevel[]

  /**  */
  unitTypes?: UnitType[]
}

export interface MinMaxCurrency {
  /**  */
  min: string

  /**  */
  max: string
}

export interface MinMax {
  /**  */
  min: number

  /**  */
  max: number
}

export interface UnitSummary {
  /**  */
  unitTypes: UnitType

  /**  */
  minIncomeRange: MinMaxCurrency

  /**  */
  occupancyRange: MinMax

  /**  */
  rentAsPercentIncomeRange: MinMax

  /**  */
  rentRange: MinMaxCurrency

  /**  */
  totalAvailable: number

  /**  */
  areaRange: MinMax

  /**  */
  floorRange?: MinMax
}

export interface UnitSummaryByAMI {
  /**  */
  percent: string

  /**  */
  byUnitType: UnitSummary[]
}

export interface HMI {
  /**  */
  columns: object

  /**  */
  rows: object[]
}

export interface UnitsSummarized {
  /**  */
  unitTypes: UnitType[]

  /**  */
  priorityTypes: UnitAccessibilityPriorityTypeEnum[]

  /**  */
  amiPercentages: string[]

  /**  */
  byUnitTypeAndRent: UnitSummary[]

  /**  */
  byUnitType: UnitSummary[]

  /**  */
  byAMI: UnitSummaryByAMI[]

  /**  */
  hmi: HMI
}

export interface UnitGroupSummary {
  /**  */
  unitTypes?: UnitType[]

  /**  */
  rentAsPercentIncomeRange?: MinMax

  /**  */
  rentRange?: MinMaxCurrency

  /**  */
  amiPercentageRange: MinMax

  /**  */
  openWaitlist: boolean

  /**  */
  unitVacancies: number

  /**  */
  floorRange?: MinMax

  /**  */
  sqFeetRange?: MinMax

  /**  */
  bathroomRange?: MinMax
}

export interface HMIColumns {
  /**  */
  "20"?: number

  /**  */
  "25"?: number

  /**  */
  "30"?: number

  /**  */
  "35"?: number

  /**  */
  "40"?: number

  /**  */
  "45"?: number

  /**  */
  "50"?: number

  /**  */
  "55"?: number

  /**  */
  "60"?: number

  /**  */
  "70"?: number

  /**  */
  "80"?: number

  /**  */
  "100"?: number

  /**  */
  "120"?: number

  /**  */
  "125"?: number

  /**  */
  "140"?: number

  /**  */
  "150"?: number

  /**  */
  householdSize: string
}

export interface HouseholdMaxIncomeSummary {
  /**  */
  columns: HMIColumns

  /**  */
  rows: HMIColumns[]
}

export interface UnitGroupsSummarized {
  /**  */
  unitGroupSummary: UnitGroupSummary[]

  /**  */
  householdMaxIncomeSummary: HouseholdMaxIncomeSummary
}

export interface UnitsSummary {
  /**  */
  id: string

  /**  */
  unitTypes: IdDTO

  /**  */
  monthlyRentMin?: number

  /**  */
  monthlyRentMax?: number

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  amiPercentage?: number

  /**  */
  minimumIncomeMin?: string

  /**  */
  minimumIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  sqFeetMin?: string

  /**  */
  sqFeetMax?: string

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  rentType?: RentTypeEnum

  /**  */
  flatRentValueFrom?: number

  /**  */
  flatRentValueTo?: number

  /**  */
  monthlyRent?: number
}

export interface ApplicationLotteryTotal {
  /**  */
  listingId: string

  /**  */
  multiselectQuestionId?: string

  /**  */
  total: number
}

export interface ListingNeighborhoodAmenities {
  /**  */
  id: string

  /**  */
  groceryStores?: string

  /**  */
  publicTransportation?: string

  /**  */
  schools?: string

  /**  */
  parksAndCommunityCenters?: string

  /**  */
  pharmacies?: string

  /**  */
  healthCareResources?: string

  /**  */
  shoppingVenues?: string

  /**  */
  hospitals?: string

  /**  */
  seniorCenters?: string

  /**  */
  recreationalFacilities?: string

  /**  */
  playgrounds?: string

  /**  */
  busStops?: string
}

export interface Property {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  url?: string

  /**  */
  urlTitle?: string

  /**  */
  jurisdictions?: IdDTO
}

export interface Listing {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  listingFileNumber?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  region?: RegionEnum

  /**  */
  configurableRegion?: string

  /**  */
  petPolicy?: string

  /**  */
  allowsDogs?: boolean

  /**  */
  allowsCats?: boolean

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  creditScreeningFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  marketingFlyer?: string

  /**  */
  accessibleMarketingFlyer?: string

  /**  */
  cocInfo?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositType?: EnumListingDepositType

  /**  */
  depositValue?: number

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  hasHudEbllClearance?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  listingType?: EnumListingListingType

  /**  */
  managementWebsite?: string

  /**  */
  name: string

  /**  */
  parkingFee?: string

  /**  */
  parkType?: ListingParkingType

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  requiredDocumentsList?: ListingDocuments

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  whatToExpectAdditionalText?: string

  /**  */
  status: ListingsStatusEnum

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum

  /**  */
  applicationConfig?: object

  /**  */
  displayWaitlistSize: boolean

  /**  */
  showWaitlist?: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  contentUpdatedAt?: Date

  /**  */
  publishedAt?: Date

  /**  */
  closedAt?: Date

  /**  */
  afsLastRunAt?: Date

  /**  */
  lotteryLastPublishedAt?: Date

  /**  */
  lotteryLastRunAt?: Date

  /**  */
  lotteryStatus?: LotteryStatusEnum

  /**  */
  lastApplicationUpdateAt?: Date

  /**  */
  listingMultiselectQuestions?: ListingMultiselectQuestion[]

  /**  */
  applicationMethods: ApplicationMethod[]

  /**  */
  referralApplication?: ApplicationMethod

  /**  */
  assets: Asset[]

  /**  */
  listingEvents: ListingEvent[]

  /**  */
  listingsBuildingAddress: Address

  /**  */
  listingsApplicationPickUpAddress?: Address

  /**  */
  listingsApplicationDropOffAddress?: Address

  /**  */
  listingsApplicationMailingAddress?: Address

  /**  */
  listingsLeasingAgentAddress?: Address

  /**  */
  listingsBuildingSelectionCriteriaFile?: Asset

  /**  */
  listingsMarketingFlyerFile?: Asset

  /**  */
  listingsAccessibleMarketingFlyerFile?: Asset

  /**  */
  jurisdictions: IdDTO

  /**  */
  listingsResult?: Asset

  /**  */
  reservedCommunityTypes?: IdDTO

  /**  */
  listingImages?: ListingImage[]

  /**  */
  listingFeatures?: ListingFeatures

  /**  */
  listingUtilities?: ListingUtilities

  /**  */
  units: Unit[]

  /**  */
  unitGroups?: UnitGroup[]

  /**  */
  unitsSummarized?: UnitsSummarized

  /**  */
  unitGroupsSummarized?: UnitGroupsSummarized

  /**  */
  unitsSummary?: UnitsSummary[]

  /**  */
  urlSlug?: string

  /**  */
  requestedChanges?: string

  /**  */
  requestedChangesDate?: Date

  /**  */
  requestedChangesUser?: IdDTO

  /**  */
  lotteryOptIn?: boolean

  /**  */
  applicationLotteryTotals: ApplicationLotteryTotal[]

  /**  */
  includeCommunityDisclaimer?: boolean

  /**  */
  communityDisclaimerTitle?: string

  /**  */
  communityDisclaimerDescription?: string

  /**  */
  marketingType?: MarketingTypeEnum

  /**  */
  marketingYear?: number

  /**  */
  marketingSeason?: MarketingSeasonEnum

  /**  */
  marketingMonth?: MonthEnum

  /**  */
  homeType?: HomeTypeEnum

  /**  */
  isVerified?: boolean

  /**  */
  section8Acceptance?: boolean

  /**  */
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenities

  /**  */
  lastUpdatedByUser?: IdDTO

  /**  */
  property?: Property
}

export interface PaginationMeta {
  /**  */
  currentPage: number

  /**  */
  itemCount: number

  /**  */
  itemsPerPage: number

  /**  */
  totalItems: number

  /**  */
  totalPages: number
}

export interface PaginatedListing {
  /**  */
  items: Listing[]

  /**  */
  meta: PaginationMeta
}

export interface ListingMapMarker {
  /**  */
  id: string

  /**  */
  lat: number

  /**  */
  lng: number
}

export interface AssetCreate {
  /**  */
  fileId: string

  /**  */
  label: string

  /**  */
  id?: string
}

export interface UnitsSummaryCreate {
  /**  */
  unitTypes: IdDTO

  /**  */
  monthlyRentMin?: number

  /**  */
  monthlyRentMax?: number

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  amiPercentage?: number

  /**  */
  minimumIncomeMin?: string

  /**  */
  minimumIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  sqFeetMin?: string

  /**  */
  sqFeetMax?: string

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  rentType?: RentTypeEnum

  /**  */
  flatRentValueFrom?: number

  /**  */
  flatRentValueTo?: number

  /**  */
  monthlyRent?: number
}

export interface ListingImageCreate {
  /**  */
  ordinal?: number

  /**  */
  assets: AssetCreate

  /**  */
  description?: string
}

export interface ListingFeaturesCreate {
  /**  */
  accessibleHeightToilet?: boolean

  /**  */
  accessibleParking?: boolean

  /**  */
  acInUnit?: boolean

  /**  */
  barrierFreeBathroom?: boolean

  /**  */
  barrierFreeEntrance?: boolean

  /**  */
  barrierFreePropertyEntrance?: boolean

  /**  */
  barrierFreeUnitEntrance?: boolean

  /**  */
  bathGrabBarsOrReinforcements?: boolean

  /**  */
  bathroomCounterLowered?: boolean

  /**  */
  brailleSignageInBuilding?: boolean

  /**  */
  carbonMonoxideDetectorWithStrobe?: boolean

  /**  */
  carpetInUnit?: boolean

  /**  */
  elevator?: boolean

  /**  */
  extraAudibleCarbonMonoxideDetector?: boolean

  /**  */
  extraAudibleSmokeDetector?: boolean

  /**  */
  fireSuppressionSprinklerSystem?: boolean

  /**  */
  frontControlsDishwasher?: boolean

  /**  */
  frontControlsStoveCookTop?: boolean

  /**  */
  grabBars?: boolean

  /**  */
  hardFlooringInUnit?: boolean

  /**  */
  hearing?: boolean

  /**  */
  hearingAndVision?: boolean

  /**  */
  heatingInUnit?: boolean

  /**  */
  inUnitWasherDryer?: boolean

  /**  */
  kitchenCounterLowered?: boolean

  /**  */
  laundryInBuilding?: boolean

  /**  */
  leverHandlesOnDoors?: boolean

  /**  */
  leverHandlesOnFaucets?: boolean

  /**  */
  loweredCabinets?: boolean

  /**  */
  loweredLightSwitch?: boolean

  /**  */
  mobility?: boolean

  /**  */
  noEntryStairs?: boolean

  /**  */
  nonDigitalKitchenAppliances?: boolean

  /**  */
  noStairsToParkingSpots?: boolean

  /**  */
  noStairsWithinUnit?: boolean

  /**  */
  parkingOnSite?: boolean

  /**  */
  refrigeratorWithBottomDoorFreezer?: boolean

  /**  */
  rollInShower?: boolean

  /**  */
  serviceAnimalsAllowed?: boolean

  /**  */
  smokeDetectorWithStrobe?: boolean

  /**  */
  streetLevelEntrance?: boolean

  /**  */
  toiletGrabBarsOrReinforcements?: boolean

  /**  */
  ttyAmplifiedPhone?: boolean

  /**  */
  turningCircleInBathrooms?: boolean

  /**  */
  visual?: boolean

  /**  */
  walkInShower?: boolean

  /**  */
  wheelchairRamp?: boolean

  /**  */
  wideDoorways?: boolean
}

export interface ListingParkingTypeCreate {
  /**  */
  onStreet?: boolean

  /**  */
  offStreet?: boolean

  /**  */
  garage?: boolean

  /**  */
  carport?: boolean
}

export interface UnitAmiChartOverrideCreate {
  /**  */
  items: AmiChartItem[]
}

export interface UnitCreate {
  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean

  /**  */
  unitTypes?: IdDTO

  /**  */
  amiChart?: IdDTO

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitRentTypes?: IdDTO

  /**  */
  unitAmiChartOverrides?: UnitAmiChartOverrideCreate
}

export interface UnitGroupAmiLevelCreate {
  /**  */
  amiPercentage?: number

  /**  */
  monthlyRentDeterminationType?: EnumUnitGroupAmiLevelCreateMonthlyRentDeterminationType

  /**  */
  percentageOfIncomeValue?: number

  /**  */
  flatRentValue?: number

  /**  */
  amiChart?: IdDTO
}

export interface UnitGroupCreate {
  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  flatRentValueFrom?: number

  /**  */
  flatRentValueTo?: number

  /**  */
  monthlyRent?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  bathroomMin?: number

  /**  */
  bathroomMax?: number

  /**  */
  openWaitlist?: boolean

  /**  */
  sqFeetMin?: number

  /**  */
  sqFeetMax?: number

  /**  */
  rentType?: RentTypeEnum

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitTypes?: IdDTO[]

  /**  */
  unitGroupAmiLevels?: UnitGroupAmiLevelCreate[]
}

export interface PaperApplicationCreate {
  /**  */
  language: LanguagesEnum

  /**  */
  assets?: AssetCreate
}

export interface ApplicationMethodCreate {
  /**  */
  type: ApplicationMethodsTypeEnum

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  paperApplications?: PaperApplicationCreate[]
}

export interface AddressCreate {
  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number
}

export interface ListingEventCreate {
  /**  */
  type: ListingEventsTypeEnum

  /**  */
  startDate?: Date

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string

  /**  */
  assets?: AssetCreate
}

export interface ListingUtilitiesCreate {
  /**  */
  water?: boolean

  /**  */
  gas?: boolean

  /**  */
  trash?: boolean

  /**  */
  sewer?: boolean

  /**  */
  electricity?: boolean

  /**  */
  cable?: boolean

  /**  */
  phone?: boolean

  /**  */
  internet?: boolean
}

export interface ListingNeighborhoodAmenitiesCreate {
  /**  */
  groceryStores?: string

  /**  */
  publicTransportation?: string

  /**  */
  schools?: string

  /**  */
  parksAndCommunityCenters?: string

  /**  */
  pharmacies?: string

  /**  */
  healthCareResources?: string

  /**  */
  shoppingVenues?: string

  /**  */
  hospitals?: string

  /**  */
  seniorCenters?: string

  /**  */
  recreationalFacilities?: string

  /**  */
  playgrounds?: string

  /**  */
  busStops?: string
}

export interface ListingCreate {
  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  listingFileNumber?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  region?: RegionEnum

  /**  */
  configurableRegion?: string

  /**  */
  petPolicy?: string

  /**  */
  allowsDogs?: boolean

  /**  */
  allowsCats?: boolean

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  creditScreeningFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  marketingFlyer?: string

  /**  */
  accessibleMarketingFlyer?: string

  /**  */
  cocInfo?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositType?: EnumListingCreateDepositType

  /**  */
  depositValue?: number

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  hasHudEbllClearance?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  listingType?: EnumListingCreateListingType

  /**  */
  managementWebsite?: string

  /**  */
  name: string

  /**  */
  parkingFee?: string

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  requiredDocumentsList?: ListingDocuments

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  whatToExpectAdditionalText?: string

  /**  */
  status: ListingsStatusEnum

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum

  /**  */
  displayWaitlistSize: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  contentUpdatedAt?: Date

  /**  */
  lotteryLastPublishedAt?: Date

  /**  */
  lotteryLastRunAt?: Date

  /**  */
  lotteryStatus?: LotteryStatusEnum

  /**  */
  lastApplicationUpdateAt?: Date

  /**  */
  jurisdictions: IdDTO

  /**  */
  reservedCommunityTypes?: IdDTO

  /**  */
  requestedChanges?: string

  /**  */
  requestedChangesDate?: Date

  /**  */
  lotteryOptIn?: boolean

  /**  */
  includeCommunityDisclaimer?: boolean

  /**  */
  communityDisclaimerTitle?: string

  /**  */
  communityDisclaimerDescription?: string

  /**  */
  marketingType?: MarketingTypeEnum

  /**  */
  marketingYear?: number

  /**  */
  marketingSeason?: MarketingSeasonEnum

  /**  */
  marketingMonth?: MonthEnum

  /**  */
  homeType?: HomeTypeEnum

  /**  */
  isVerified?: boolean

  /**  */
  section8Acceptance?: boolean

  /**  */
  lastUpdatedByUser?: IdDTO

  /**  */
  listingMultiselectQuestions?: IdDTO[]

  /**  */
  assets?: AssetCreate[]

  /**  */
  unitsSummary: UnitsSummaryCreate[]

  /**  */
  listingImages?: ListingImageCreate[]

  /**  */
  listingsBuildingSelectionCriteriaFile?: AssetCreate

  /**  */
  listingsMarketingFlyerFile?: AssetCreate

  /**  */
  listingsAccessibleMarketingFlyerFile?: AssetCreate

  /**  */
  listingsResult?: AssetCreate

  /**  */
  listingFeatures?: ListingFeaturesCreate

  /**  */
  parkType?: ListingParkingTypeCreate

  /**  */
  requestedChangesUser?: IdDTO

  /**  */
  property?: IdDTO

  /**  */
  units?: UnitCreate[]

  /**  */
  unitGroups?: UnitGroupCreate[]

  /**  */
  applicationMethods?: ApplicationMethodCreate[]

  /**  */
  listingsApplicationPickUpAddress?: AddressCreate

  /**  */
  listingsApplicationMailingAddress?: AddressCreate

  /**  */
  listingsApplicationDropOffAddress?: AddressCreate

  /**  */
  listingsLeasingAgentAddress?: AddressCreate

  /**  */
  listingsBuildingAddress?: AddressCreate

  /**  */
  listingEvents: ListingEventCreate[]

  /**  */
  listingUtilities?: ListingUtilitiesCreate

  /**  */
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenitiesCreate
}

export interface ListingDuplicate {
  /**  */
  name: string

  /**  */
  includeUnits: boolean

  /**  */
  storedListing: IdDTO
}

export interface UnitAmiChartOverrideUpdate {
  /**  */
  items: AmiChartItem[]

  /**  */
  id?: string
}

export interface UnitUpdate {
  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean

  /**  */
  id?: string

  /**  */
  unitTypes?: IdDTO

  /**  */
  amiChart?: IdDTO

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitRentTypes?: IdDTO

  /**  */
  unitAmiChartOverrides?: UnitAmiChartOverrideUpdate
}

export interface UnitGroupAmiLevelUpdate {
  /**  */
  amiPercentage?: number

  /**  */
  monthlyRentDeterminationType?: EnumUnitGroupAmiLevelUpdateMonthlyRentDeterminationType

  /**  */
  percentageOfIncomeValue?: number

  /**  */
  flatRentValue?: number

  /**  */
  id?: string

  /**  */
  amiChart?: IdDTO
}

export interface UnitGroupUpdate {
  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  flatRentValueFrom?: number

  /**  */
  flatRentValueTo?: number

  /**  */
  monthlyRent?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  bathroomMin?: number

  /**  */
  bathroomMax?: number

  /**  */
  openWaitlist?: boolean

  /**  */
  sqFeetMin?: number

  /**  */
  sqFeetMax?: number

  /**  */
  rentType?: RentTypeEnum

  /**  */
  id?: string

  /**  */
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum

  /**  */
  unitTypes?: IdDTO[]

  /**  */
  unitGroupAmiLevels?: UnitGroupAmiLevelUpdate[]
}

export interface PaperApplicationUpdate {
  /**  */
  language: LanguagesEnum

  /**  */
  id?: string

  /**  */
  assets?: AssetCreate
}

export interface ApplicationMethodUpdate {
  /**  */
  type: ApplicationMethodsTypeEnum

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  id?: string

  /**  */
  paperApplications?: PaperApplicationUpdate[]
}

export interface AddressUpdate {
  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number

  /**  */
  id?: string
}

export interface ListingEventUpdate {
  /**  */
  type: ListingEventsTypeEnum

  /**  */
  startDate?: Date

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string

  /**  */
  assets?: AssetCreate

  /**  */
  id?: string
}

export interface ListingFeaturesUpdate {
  /**  */
  accessibleHeightToilet?: boolean

  /**  */
  accessibleParking?: boolean

  /**  */
  acInUnit?: boolean

  /**  */
  barrierFreeBathroom?: boolean

  /**  */
  barrierFreeEntrance?: boolean

  /**  */
  barrierFreePropertyEntrance?: boolean

  /**  */
  barrierFreeUnitEntrance?: boolean

  /**  */
  bathGrabBarsOrReinforcements?: boolean

  /**  */
  bathroomCounterLowered?: boolean

  /**  */
  brailleSignageInBuilding?: boolean

  /**  */
  carbonMonoxideDetectorWithStrobe?: boolean

  /**  */
  carpetInUnit?: boolean

  /**  */
  elevator?: boolean

  /**  */
  extraAudibleCarbonMonoxideDetector?: boolean

  /**  */
  extraAudibleSmokeDetector?: boolean

  /**  */
  fireSuppressionSprinklerSystem?: boolean

  /**  */
  frontControlsDishwasher?: boolean

  /**  */
  frontControlsStoveCookTop?: boolean

  /**  */
  grabBars?: boolean

  /**  */
  hardFlooringInUnit?: boolean

  /**  */
  hearing?: boolean

  /**  */
  hearingAndVision?: boolean

  /**  */
  heatingInUnit?: boolean

  /**  */
  inUnitWasherDryer?: boolean

  /**  */
  kitchenCounterLowered?: boolean

  /**  */
  laundryInBuilding?: boolean

  /**  */
  leverHandlesOnDoors?: boolean

  /**  */
  leverHandlesOnFaucets?: boolean

  /**  */
  loweredCabinets?: boolean

  /**  */
  loweredLightSwitch?: boolean

  /**  */
  mobility?: boolean

  /**  */
  noEntryStairs?: boolean

  /**  */
  nonDigitalKitchenAppliances?: boolean

  /**  */
  noStairsToParkingSpots?: boolean

  /**  */
  noStairsWithinUnit?: boolean

  /**  */
  parkingOnSite?: boolean

  /**  */
  refrigeratorWithBottomDoorFreezer?: boolean

  /**  */
  rollInShower?: boolean

  /**  */
  serviceAnimalsAllowed?: boolean

  /**  */
  smokeDetectorWithStrobe?: boolean

  /**  */
  streetLevelEntrance?: boolean

  /**  */
  toiletGrabBarsOrReinforcements?: boolean

  /**  */
  ttyAmplifiedPhone?: boolean

  /**  */
  turningCircleInBathrooms?: boolean

  /**  */
  visual?: boolean

  /**  */
  walkInShower?: boolean

  /**  */
  wheelchairRamp?: boolean

  /**  */
  wideDoorways?: boolean

  /**  */
  id?: string
}

export interface ListingUtilitiesUpdate {
  /**  */
  water?: boolean

  /**  */
  gas?: boolean

  /**  */
  trash?: boolean

  /**  */
  sewer?: boolean

  /**  */
  electricity?: boolean

  /**  */
  cable?: boolean

  /**  */
  phone?: boolean

  /**  */
  internet?: boolean

  /**  */
  id?: string
}

export interface ListingParkingTypeUpdate {
  /**  */
  onStreet?: boolean

  /**  */
  offStreet?: boolean

  /**  */
  garage?: boolean

  /**  */
  carport?: boolean

  /**  */
  id?: string
}

export interface ListingNeighborhoodAmenitiesUpdate {
  /**  */
  groceryStores?: string

  /**  */
  publicTransportation?: string

  /**  */
  schools?: string

  /**  */
  parksAndCommunityCenters?: string

  /**  */
  pharmacies?: string

  /**  */
  healthCareResources?: string

  /**  */
  shoppingVenues?: string

  /**  */
  hospitals?: string

  /**  */
  seniorCenters?: string

  /**  */
  recreationalFacilities?: string

  /**  */
  playgrounds?: string

  /**  */
  busStops?: string

  /**  */
  id?: string
}

export interface ListingUpdate {
  /**  */
  id: string

  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  listingFileNumber?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  region?: RegionEnum

  /**  */
  configurableRegion?: string

  /**  */
  petPolicy?: string

  /**  */
  allowsDogs?: boolean

  /**  */
  allowsCats?: boolean

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  creditScreeningFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  marketingFlyer?: string

  /**  */
  accessibleMarketingFlyer?: string

  /**  */
  cocInfo?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositType?: EnumListingUpdateDepositType

  /**  */
  depositValue?: number

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  hasHudEbllClearance?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  listingType?: EnumListingUpdateListingType

  /**  */
  managementWebsite?: string

  /**  */
  name: string

  /**  */
  parkingFee?: string

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  requiredDocumentsList?: ListingDocuments

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  whatToExpectAdditionalText?: string

  /**  */
  status: ListingsStatusEnum

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum

  /**  */
  displayWaitlistSize: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  contentUpdatedAt?: Date

  /**  */
  lotteryLastPublishedAt?: Date

  /**  */
  lotteryLastRunAt?: Date

  /**  */
  lotteryStatus?: LotteryStatusEnum

  /**  */
  lastApplicationUpdateAt?: Date

  /**  */
  jurisdictions: IdDTO

  /**  */
  reservedCommunityTypes?: IdDTO

  /**  */
  requestedChanges?: string

  /**  */
  requestedChangesDate?: Date

  /**  */
  lotteryOptIn?: boolean

  /**  */
  includeCommunityDisclaimer?: boolean

  /**  */
  communityDisclaimerTitle?: string

  /**  */
  communityDisclaimerDescription?: string

  /**  */
  marketingType?: MarketingTypeEnum

  /**  */
  marketingYear?: number

  /**  */
  marketingSeason?: MarketingSeasonEnum

  /**  */
  marketingMonth?: MonthEnum

  /**  */
  homeType?: HomeTypeEnum

  /**  */
  isVerified?: boolean

  /**  */
  section8Acceptance?: boolean

  /**  */
  lastUpdatedByUser?: IdDTO

  /**  */
  listingMultiselectQuestions?: IdDTO[]

  /**  */
  units?: UnitUpdate[]

  /**  */
  unitGroups?: UnitGroupUpdate[]

  /**  */
  applicationMethods?: ApplicationMethodUpdate[]

  /**  */
  assets?: AssetCreate[]

  /**  */
  unitsSummary: UnitsSummaryCreate[]

  /**  */
  listingImages?: ListingImageCreate[]

  /**  */
  listingsApplicationPickUpAddress?: AddressUpdate

  /**  */
  listingsApplicationMailingAddress?: AddressUpdate

  /**  */
  listingsApplicationDropOffAddress?: AddressUpdate

  /**  */
  listingsLeasingAgentAddress?: AddressUpdate

  /**  */
  listingsBuildingAddress?: AddressUpdate

  /**  */
  listingsBuildingSelectionCriteriaFile?: AssetCreate

  /**  */
  listingsMarketingFlyerFile?: AssetCreate

  /**  */
  listingsAccessibleMarketingFlyerFile?: AssetCreate

  /**  */
  listingsResult?: AssetCreate

  /**  */
  listingEvents: ListingEventUpdate[]

  /**  */
  listingFeatures?: ListingFeaturesUpdate

  /**  */
  listingUtilities?: ListingUtilitiesUpdate

  /**  */
  parkType?: ListingParkingTypeUpdate

  /**  */
  requestedChangesUser?: IdDTO

  /**  */
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenitiesUpdate

  /**  */
  property?: IdDTO
}

export interface Accessibility {
  /**  */
  id: string

  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean

  /**  */
  other?: boolean
}

export interface Demographic {
  /**  */
  id: string

  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race: string[]

  /**  */
  spokenLanguage?: string
}

export interface Applicant {
  /**  */
  id: string

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  applicantWorkAddress: Address

  /**  */
  applicantAddress: Address
}

export interface AlternateContact {
  /**  */
  id: string

  /**  */
  type?: AlternateContactRelationship

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string

  /**  */
  address: Address
}

export interface HouseholdMember {
  /**  */
  id: string

  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  sameAddress?: YesNoEnum

  /**  */
  relationship?: HouseholdMemberRelationship

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  householdMemberWorkAddress?: Address

  /**  */
  householdMemberAddress: Address
}

export interface ApplicationSelectionOption {
  /**  */
  id: string

  /**  */
  addressHolderAddress: Address

  /**  */
  addressHolderName?: string

  /**  */
  addressHolderRelationship?: string

  /**  */
  applicationSelection: IdDTO

  /**  */
  isGeocodingVerified?: boolean

  /**  */
  multiselectOption: IdDTO
}

export interface ApplicationSelection {
  /**  */
  id: string

  /**  */
  application: IdDTO

  /**  */
  hasOptedOut?: boolean

  /**  */
  multiselectQuestion: IdDTO

  /**  */
  selections: ApplicationSelectionOption
}

export interface ApplicationMultiselectQuestionOption {
  /**  */
  key: string

  /**  */
  checked: boolean

  /**  */
  mapPinPosition?: string

  /**  */
  extraData?: AllExtraDataTypes[]
}

export interface ApplicationMultiselectQuestion {
  /**  */
  multiselectQuestionId: string

  /**  */
  key: string

  /**  */
  claimed: boolean

  /**  */
  options: ApplicationMultiselectQuestionOption[]
}

export interface ApplicationLotteryPosition {
  /**  */
  listingId: string

  /**  */
  applicationId: string

  /**  */
  multiselectQuestionId: string

  /**  */
  ordinal: number
}

export interface Application {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  deletedAt?: Date

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  incomePeriod?: IncomePeriodEnum

  /**  */
  status: ApplicationStatusEnum

  /**  */
  accessibleUnitWaitlistNumber?: number

  /**  */
  conventionalUnitWaitlistNumber?: number

  /**  */
  manualLotteryPositionNumber?: number

  /**  */
  language?: LanguagesEnum

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionType: ApplicationSubmissionTypeEnum

  /**  */
  submissionDate?: Date

  /**  */
  markedAsDuplicate: boolean

  /**  */
  flagged?: boolean

  /**  */
  confirmationCode: string

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum

  /**  */
  applicationsMailingAddress: Address

  /**  */
  applicationsAlternateAddress: Address

  /**  */
  accessibility: Accessibility

  /**  */
  demographics: Demographic

  /**  */
  preferredUnitTypes: UnitType[]

  /**  */
  applicant: Applicant

  /**  */
  alternateContact: AlternateContact

  /**  */
  householdMember: HouseholdMember[]

  /**  */
  applicationSelections?: ApplicationSelection[]

  /**  */
  preferences?: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  listings: IdDTO

  /**  */
  applicationLotteryPositions: ApplicationLotteryPosition[]

  /**  */
  isNewest?: boolean
}

export interface ApplicationFlaggedSet {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  resolvingUser: IdDTO

  /**  */
  listing: IdDTO

  /**  */
  rule: RuleEnum

  /**  */
  ruleKey: string

  /**  */
  resolvedTime?: Date

  /**  */
  listingId: string

  /**  */
  showConfirmationAlert: boolean

  /**  */
  status: FlaggedSetStatusEnum

  /**  */
  applications: Application[]
}

export interface ApplicationFlaggedSetPaginationMeta {
  /**  */
  currentPage: number

  /**  */
  itemCount: number

  /**  */
  itemsPerPage: number

  /**  */
  totalItems: number

  /**  */
  totalPages: number

  /**  */
  totalFlagged: number
}

export interface PaginatedAfs {
  /**  */
  items: ApplicationFlaggedSet[]

  /**  */
  meta: ApplicationFlaggedSetPaginationMeta
}

export interface AfsMeta {
  /**  */
  totalCount?: number

  /**  */
  totalResolvedCount?: number

  /**  */
  totalPendingCount?: number

  /**  */
  totalNamePendingCount?: number

  /**  */
  totalEmailPendingCount?: number
}

export interface AfsResolve {
  /**  */
  afsId: string

  /**  */
  status: FlaggedSetStatusEnum

  /**  */
  applications: IdDTO[]
}

export interface MultiselectOptionCreate {
  /**  */
  collectAddress?: boolean

  /**  */
  collectName?: boolean

  /**  */
  collectRelationship?: boolean

  /**  */
  description?: string

  /**  */
  exclusive?: boolean

  /**  */
  isOptOut?: boolean

  /**  */
  links?: MultiselectLink[]

  /**  */
  mapLayerId?: string

  /**  */
  mapPinPosition?: string

  /**  */
  multiselectQuestion?: IdDTO

  /**  */
  name?: string

  /**  */
  ordinal: number

  /**  */
  radiusSize?: number

  /**  */
  shouldCollectAddress?: boolean

  /**  */
  shouldCollectName?: boolean

  /**  */
  shouldCollectRelationship?: boolean

  /**  */
  text: string

  /**  */
  validationMethod?: ValidationMethodEnum
}

export interface MultiselectQuestionCreate {
  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum

  /**  */
  description?: string

  /**  */
  isExclusive?: boolean

  /**  */
  hideFromListing?: boolean

  /**  */
  jurisdiction?: IdDTO

  /**  */
  jurisdictions: IdDTO[]

  /**  */
  links?: MultiselectLink[]

  /**  */
  name?: string

  /**  */
  optOutText?: string

  /**  */
  status: MultiselectQuestionsStatusEnum

  /**  */
  subText?: string

  /**  */
  text: string

  /**  */
  untranslatedOptOutText?: string

  /**  */
  multiselectOptions?: MultiselectOptionCreate[]

  /**  */
  options?: MultiselectOptionCreate[]
}

export interface MultiselectOptionUpdate {
  /**  */
  collectAddress?: boolean

  /**  */
  collectName?: boolean

  /**  */
  collectRelationship?: boolean

  /**  */
  description?: string

  /**  */
  exclusive?: boolean

  /**  */
  isOptOut?: boolean

  /**  */
  links?: MultiselectLink[]

  /**  */
  mapLayerId?: string

  /**  */
  mapPinPosition?: string

  /**  */
  multiselectQuestion?: IdDTO

  /**  */
  name?: string

  /**  */
  ordinal: number

  /**  */
  radiusSize?: number

  /**  */
  shouldCollectAddress?: boolean

  /**  */
  shouldCollectName?: boolean

  /**  */
  shouldCollectRelationship?: boolean

  /**  */
  text: string

  /**  */
  validationMethod?: ValidationMethodEnum

  /**  */
  id?: string
}

export interface MultiselectQuestionUpdate {
  /**  */
  id: string

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum

  /**  */
  description?: string

  /**  */
  isExclusive?: boolean

  /**  */
  hideFromListing?: boolean

  /**  */
  jurisdiction?: IdDTO

  /**  */
  jurisdictions: IdDTO[]

  /**  */
  links?: MultiselectLink[]

  /**  */
  name?: string

  /**  */
  optOutText?: string

  /**  */
  status: MultiselectQuestionsStatusEnum

  /**  */
  subText?: string

  /**  */
  text: string

  /**  */
  untranslatedOptOutText?: string

  /**  */
  multiselectOptions?: MultiselectOptionUpdate[]

  /**  */
  options?: MultiselectOptionUpdate[]
}

export interface MultiselectQuestionQueryParams {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"

  /**  */
  filter?: string[]

  /**  */
  orderBy?: MultiselectQuestionOrderByKeys[]

  /**  */
  orderDir?: OrderByEnum[]

  /**  */
  search?: string

  /**  */
  view?: MultiselectQuestionViews
}

export interface MultiselectQuestionFilterParams {
  /**  */
  $comparison: EnumMultiselectQuestionFilterParamsComparison

  /**  */
  applicationSection?: MultiselectQuestionsApplicationSectionEnum

  /**  */
  jurisdiction?: string

  /**  */
  status?: MultiselectQuestionsStatusEnum
}

export interface PaginatedMultiselectQuestion {
  /**  */
  items: MultiselectQuestion[]

  /**  */
  meta: PaginationMeta
}

export interface AmiChartQueryParams {
  /**  */
  jurisdictionId?: string
}

export interface AmiChartCreate {
  /**  */
  items: AmiChartItem[]

  /**  */
  name: string

  /**  */
  jurisdictions: IdDTO
}

export interface AmiChartUpdate {
  /**  */
  id: string

  /**  */
  items: AmiChartItem[]

  /**  */
  name: string
}

export interface ReservedCommunityTypeQueryParams {
  /**  */
  jurisdictionId?: string
}

export interface ReservedCommunityType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  jurisdictions: IdDTO
}

export interface ReservedCommunityTypeCreate {
  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  jurisdictions: IdDTO
}

export interface ReservedCommunityTypeUpdate {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  description?: string
}

export interface UnitTypeCreate {
  /**  */
  name: UnitTypeEnum

  /**  */
  numBedrooms: number
}

export interface UnitTypeUpdate {
  /**  */
  id: string

  /**  */
  name: UnitTypeEnum

  /**  */
  numBedrooms: number
}

export interface UnitRentTypeCreate {
  /**  */
  name: UnitRentTypeEnum
}

export interface UnitRentTypeUpdate {
  /**  */
  id: string

  /**  */
  name: UnitRentTypeEnum
}

export interface ListingFeatureField {
  /**  */
  id: string
}

export interface ListingFeatureCategory {
  /**  */
  id: string

  /**  */
  fields: ListingFeatureField[]

  /**  */
  required?: boolean
}

export interface ListingFeaturesConfiguration {
  /** Categorized features (use this or the flat list, not both) */
  categories?: ListingFeatureCategory[]

  /** Flat list of features (use this or the categories, not both) */
  fields?: ListingFeatureField[]
}

export interface RaceEthnicitySubOption {
  /**  */
  id: string

  /**  */
  allowOtherText?: boolean
}

export interface RaceEthnicityOption {
  /**  */
  id: string

  /** The list of suboptions if this option has them */
  subOptions?: RaceEthnicitySubOption[]

  /** Whether this option allows free text input */
  allowOtherText?: boolean
}

export interface RaceEthnicityConfiguration {
  /** List of race\/ethnicity options available for this jurisdiction */
  options: RaceEthnicityOption[]
}

export interface JurisdictionCreate {
  /**  */
  name: string

  /**  */
  notificationsSignUpUrl?: string

  /**  */
  languages: LanguagesEnum[]

  /**  */
  minimumListingPublishImagesRequired?: number

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  whatToExpect: string

  /**  */
  whatToExpectAdditionalText: string

  /**  */
  whatToExpectUnderConstruction: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enablePartnerDemographics?: boolean

  /**  */
  enableGeocodingPreferences?: boolean

  /**  */
  enableGeocodingRadiusMethod?: boolean

  /**  */
  allowSingleUseCodeLogin: boolean

  /**  */
  listingApprovalPermissions: UserRoleEnum[]

  /**  */
  duplicateListingPermissions: UserRoleEnum[]

  /**  */
  requiredListingFields: []

  /**  */
  visibleNeighborhoodAmenities: NeighborhoodAmenitiesEnum[]

  /**  */
  visibleAccessibilityPriorityTypes: UnitAccessibilityPriorityTypeEnum[]

  /**  */
  visibleSpokenLanguages: SpokenLanguageEnum[]

  /**  */
  regions: []

  /**  */
  listingFeaturesConfiguration?: ListingFeaturesConfiguration

  /**  */
  raceEthnicityConfiguration?: RaceEthnicityConfiguration
}

export interface JurisdictionUpdate {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  notificationsSignUpUrl?: string

  /**  */
  languages: LanguagesEnum[]

  /**  */
  minimumListingPublishImagesRequired?: number

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  whatToExpect: string

  /**  */
  whatToExpectAdditionalText: string

  /**  */
  whatToExpectUnderConstruction: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enablePartnerDemographics?: boolean

  /**  */
  enableGeocodingPreferences?: boolean

  /**  */
  enableGeocodingRadiusMethod?: boolean

  /**  */
  allowSingleUseCodeLogin: boolean

  /**  */
  listingApprovalPermissions: UserRoleEnum[]

  /**  */
  duplicateListingPermissions: UserRoleEnum[]

  /**  */
  requiredListingFields: []

  /**  */
  visibleNeighborhoodAmenities: NeighborhoodAmenitiesEnum[]

  /**  */
  visibleAccessibilityPriorityTypes: UnitAccessibilityPriorityTypeEnum[]

  /**  */
  visibleSpokenLanguages: SpokenLanguageEnum[]

  /**  */
  regions: []

  /**  */
  listingFeaturesConfiguration?: ListingFeaturesConfiguration

  /**  */
  raceEthnicityConfiguration?: RaceEthnicityConfiguration
}

export interface FeatureFlag {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: FeatureFlagEnum

  /**  */
  description: string

  /**  */
  active: boolean

  /**  */
  jurisdictions: IdDTO[]
}

export interface Jurisdiction {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  notificationsSignUpUrl?: string

  /**  */
  languages: LanguagesEnum[]

  /**  */
  multiselectQuestions: IdDTO[]

  /**  */
  minimumListingPublishImagesRequired?: number

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  whatToExpect: string

  /**  */
  whatToExpectAdditionalText: string

  /**  */
  whatToExpectUnderConstruction: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enablePartnerDemographics?: boolean

  /**  */
  enableGeocodingPreferences?: boolean

  /**  */
  enableGeocodingRadiusMethod?: boolean

  /**  */
  allowSingleUseCodeLogin: boolean

  /**  */
  listingApprovalPermissions: UserRoleEnum[]

  /**  */
  duplicateListingPermissions: UserRoleEnum[]

  /**  */
  featureFlags: FeatureFlag[]

  /**  */
  requiredListingFields: []

  /**  */
  visibleNeighborhoodAmenities: NeighborhoodAmenitiesEnum[]

  /**  */
  visibleAccessibilityPriorityTypes: UnitAccessibilityPriorityTypeEnum[]

  /**  */
  visibleSpokenLanguages: SpokenLanguageEnum[]

  /**  */
  regions: []

  /**  */
  listingFeaturesConfiguration?: ListingFeaturesConfiguration

  /**  */
  raceEthnicityConfiguration?: RaceEthnicityConfiguration
}

export interface AddressInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: AddressCreate
}

export interface BooleanInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: boolean
}

export interface TextInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: string
}

export interface PaginatedApplication {
  /**  */
  items: Application[]

  /**  */
  meta: PaginationMeta
}

export interface PublicAppsFiltered {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  deletedAt?: Date

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  incomePeriod?: IncomePeriodEnum

  /**  */
  status: ApplicationStatusEnum

  /**  */
  accessibleUnitWaitlistNumber?: number

  /**  */
  conventionalUnitWaitlistNumber?: number

  /**  */
  manualLotteryPositionNumber?: number

  /**  */
  language?: LanguagesEnum

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionType: ApplicationSubmissionTypeEnum

  /**  */
  submissionDate?: Date

  /**  */
  markedAsDuplicate: boolean

  /**  */
  flagged?: boolean

  /**  */
  confirmationCode: string

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum

  /**  */
  applicationsMailingAddress: Address

  /**  */
  applicationsAlternateAddress: Address

  /**  */
  accessibility: Accessibility

  /**  */
  demographics: Demographic

  /**  */
  preferredUnitTypes: UnitType[]

  /**  */
  applicant: Applicant

  /**  */
  alternateContact: AlternateContact

  /**  */
  householdMember: HouseholdMember[]

  /**  */
  applicationSelections?: ApplicationSelection[]

  /**  */
  preferences?: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  applicationLotteryPositions: ApplicationLotteryPosition[]

  /**  */
  isNewest?: boolean

  /**  */
  listings: Listing
}

export interface PublicAppsCount {
  /**  */
  total: number

  /**  */
  lottery: number

  /**  */
  closed: number

  /**  */
  open: number
}

export interface PublicAppsViewResponse {
  /**  */
  items: PublicAppsFiltered[]

  /**  */
  meta: PaginationMeta

  /**  */
  applicationsCount: PublicAppsCount
}

export interface ApplicationSelectionOptionCreate {
  /**  */
  addressHolderName?: string

  /**  */
  addressHolderRelationship?: string

  /**  */
  isGeocodingVerified?: boolean

  /**  */
  multiselectOption: IdDTO

  /**  */
  applicationSelection?: IdDTO

  /**  */
  addressHolderAddress?: AddressCreate
}

export interface ApplicationSelectionCreate {
  /**  */
  hasOptedOut?: boolean

  /**  */
  multiselectQuestion: IdDTO

  /**  */
  selections: ApplicationSelectionOptionCreate[]
}

export interface AccessibilityCreate {
  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean

  /**  */
  other?: boolean
}

export interface AlternateContactCreate {
  /**  */
  type?: AlternateContactRelationship

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string

  /**  */
  address: AddressCreate
}

export interface ApplicantCreate {
  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  applicantAddress: AddressCreate

  /**  */
  applicantWorkAddress: AddressCreate
}

export interface DemographicCreate {
  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race: string[]

  /**  */
  spokenLanguage?: string
}

export interface HouseholdMemberCreate {
  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  sameAddress?: YesNoEnum

  /**  */
  relationship?: HouseholdMemberRelationship

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  householdMemberAddress: AddressCreate

  /**  */
  householdMemberWorkAddress?: AddressCreate
}

export interface ApplicationCreate {
  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  incomePeriod?: IncomePeriodEnum

  /**  */
  status: ApplicationStatusEnum

  /**  */
  accessibleUnitWaitlistNumber?: number

  /**  */
  conventionalUnitWaitlistNumber?: number

  /**  */
  manualLotteryPositionNumber?: number

  /**  */
  language?: LanguagesEnum

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionType: ApplicationSubmissionTypeEnum

  /**  */
  submissionDate?: Date

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum

  /**  */
  preferences?: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  listings: IdDTO

  /**  */
  isNewest?: boolean

  /**  */
  preferredUnitTypes: IdDTO[]

  /**  */
  applicationSelections?: ApplicationSelectionCreate[]

  /**  */
  accessibility: AccessibilityCreate

  /**  */
  alternateContact: AlternateContactCreate

  /**  */
  applicant: ApplicantCreate

  /**  */
  applicationsMailingAddress: AddressCreate

  /**  */
  applicationsAlternateAddress: AddressCreate

  /**  */
  demographics: DemographicCreate

  /**  */
  householdMember: HouseholdMemberCreate[]
}

export interface AccessibilityUpdate {
  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean

  /**  */
  other?: boolean

  /**  */
  id?: string
}

export interface AlternateContactUpdate {
  /**  */
  type?: AlternateContactRelationship

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string

  /**  */
  id?: string

  /**  */
  address: AddressUpdate
}

export interface ApplicantUpdate {
  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  id?: string

  /**  */
  applicantAddress: AddressUpdate

  /**  */
  applicantWorkAddress: AddressUpdate
}

export interface ApplicationSelectionOptionUpdate {
  /**  */
  addressHolderName?: string

  /**  */
  addressHolderRelationship?: string

  /**  */
  isGeocodingVerified?: boolean

  /**  */
  multiselectOption: IdDTO

  /**  */
  id?: string

  /**  */
  addressHolderAddress?: AddressUpdate

  /**  */
  applicationSelection?: IdDTO
}

export interface ApplicationSelectionUpdate {
  /**  */
  application: IdDTO

  /**  */
  hasOptedOut?: boolean

  /**  */
  multiselectQuestion: IdDTO

  /**  */
  id?: string

  /**  */
  selections: ApplicationSelectionOptionUpdate[]
}

export interface DemographicUpdate {
  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race: string[]

  /**  */
  spokenLanguage?: string

  /**  */
  id?: string
}

export interface HouseholdMemberUpdate {
  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  sameAddress?: YesNoEnum

  /**  */
  relationship?: HouseholdMemberRelationship

  /**  */
  workInRegion?: YesNoEnum

  /**  */
  fullTimeStudent?: YesNoEnum

  /**  */
  id?: string

  /**  */
  householdMemberAddress: AddressUpdate

  /**  */
  householdMemberWorkAddress?: AddressUpdate
}

export interface ApplicationUpdate {
  /**  */
  id: string

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  incomePeriod?: IncomePeriodEnum

  /**  */
  status: ApplicationStatusEnum

  /**  */
  accessibleUnitWaitlistNumber?: number

  /**  */
  conventionalUnitWaitlistNumber?: number

  /**  */
  manualLotteryPositionNumber?: number

  /**  */
  language?: LanguagesEnum

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionType: ApplicationSubmissionTypeEnum

  /**  */
  submissionDate?: Date

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum

  /**  */
  preferences?: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  listings: IdDTO

  /**  */
  isNewest?: boolean

  /**  */
  accessibility: AccessibilityUpdate

  /**  */
  alternateContact: AlternateContactUpdate

  /**  */
  applicant: ApplicantUpdate

  /**  */
  applicationSelections?: ApplicationSelectionUpdate[]

  /**  */
  applicationsMailingAddress: AddressUpdate

  /**  */
  applicationsAlternateAddress: AddressUpdate

  /**  */
  demographics: DemographicUpdate

  /**  */
  householdMember: HouseholdMemberUpdate[]

  /**  */
  preferredUnitTypes: IdDTO[]
}

export interface ApplicationUpdateEmail {
  /**  */
  previousStatus?: ApplicationStatusEnum

  /**  */
  previousAccessibleUnitWaitlistNumber?: number

  /**  */
  previousConventionalUnitWaitlistNumber?: number
}

export interface CreatePresignedUploadMetadata {
  /**  */
  parametersToSign: object
}

export interface CreatePresignedUploadMetadataResponse {
  /**  */
  signature: string
}

export interface EmailAndAppUrl {
  /**  */
  email: string

  /**  */
  appUrl?: string
}

export interface UserRole {
  /**  */
  isAdmin?: boolean

  /**  */
  isJurisdictionalAdmin?: boolean

  /**  */
  isLimitedJurisdictionalAdmin?: boolean

  /**  */
  isPartner?: boolean

  /**  */
  isSuperAdmin?: boolean

  /**  */
  isSupportAdmin?: boolean
}

export interface Agency {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  jurisdictions: IdDTO
}

export interface PublicUserCreate {
  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  phoneNumber?: string

  /**  */
  listings: IdDTO[]

  /**  */
  userRoles?: UserRole

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  agency?: Agency

  /**  */
  address?: Address

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string

  /**  */
  dob: Date

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: IdDTO[]

  /**  */
  password: string

  /**  */
  passwordConfirmation: string

  /**  */
  emailConfirmation?: string
}

export interface PartnerUserCreate {
  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  listings: IdDTO[]

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  agency?: Agency

  /**  */
  address?: Address

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string

  /**  */
  userRoles: UserRole

  /**  */
  appUrl?: string

  /**  */
  jurisdictions: IdDTO[]
}

export interface AdvocateUserCreate {
  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  listings: IdDTO[]

  /**  */
  userRoles?: UserRole

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  agency: IdDTO

  /**  */
  address: AddressUpdate

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: IdDTO[]
}

export interface PublicUserUpdate {
  /**  */
  id: string

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  phoneNumber?: string

  /**  */
  listings: IdDTO[]

  /**  */
  userRoles?: UserRole

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  agency?: Agency

  /**  */
  address?: Address

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string

  /**  */
  dob: Date

  /**  */
  newEmail?: string

  /**  */
  password?: string

  /**  */
  currentPassword?: string

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: IdDTO[]
}

export interface PartnerUserUpdate {
  /**  */
  id: string

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  listings: IdDTO[]

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  agency?: Agency

  /**  */
  address?: Address

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string

  /**  */
  userRoles: UserRole

  /**  */
  newEmail?: string

  /**  */
  password?: string

  /**  */
  currentPassword?: string

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: IdDTO[]
}

export interface AdvocateUserUpdate {
  /**  */
  id: string

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  listings: IdDTO[]

  /**  */
  userRoles?: UserRole

  /**  */
  language?: LanguagesEnum

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string

  /**  */
  agency: IdDTO

  /**  */
  address: AddressUpdate

  /**  */
  phoneNumber: string

  /**  */
  newEmail?: string

  /**  */
  password?: string

  /**  */
  currentPassword?: string

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: IdDTO[]
}

export interface User {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  passwordUpdatedAt: Date

  /**  */
  passwordValidForDays: number

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  listings: IdDTO[]

  /**  */
  userRoles?: UserRole

  /**  */
  language?: LanguagesEnum

  /**  */
  jurisdictions: Jurisdiction[]

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date

  /**  */
  activeAccessToken?: string

  /**  */
  activeRefreshToken?: string

  /**  */
  favoriteListings?: IdDTO[]

  /**  */
  title?: string

  /**  */
  agency?: Agency

  /**  */
  address?: Address

  /**  */
  phoneType?: string

  /**  */
  phoneExtension?: string

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  additionalPhoneExtension?: string
}

export interface UserFilterParams {
  /**  */
  isPortalUser?: boolean
}

export interface PaginatedUser {
  /**  */
  items: User[]

  /**  */
  meta: PaginationMeta
}

export interface UserDeleteDTO {
  /**  */
  id: string

  /**  */
  shouldRemoveApplication?: boolean
}

export interface RequestSingleUseCode {
  /**  */
  email: string
}

export interface ConfirmationRequest {
  /**  */
  token: string
}

export interface UserFavoriteListing {
  /**  */
  id: string

  /**  */
  action: ModificationEnum
}

export interface Login {
  /**  */
  email: string

  /**  */
  password: string

  /**  */
  mfaCode?: string

  /**  */
  mfaType?: MfaType

  /**  */
  reCaptchaToken?: string
}

export interface LoginViaSingleUseCode {
  /**  */
  email: string

  /**  */
  singleUseCode: string
}

export interface RequestMfaCode {
  /**  */
  email: string

  /**  */
  password: string

  /**  */
  mfaType: MfaType

  /**  */
  phoneNumber?: string
}

export interface RequestMfaCodeResponse {
  /**  */
  phoneNumber?: string

  /**  */
  email?: string

  /**  */
  phoneNumberVerified?: boolean
}

export interface UpdatePassword {
  /**  */
  password: string

  /**  */
  passwordConfirmation: string

  /**  */
  token: string
}

export interface Confirm {
  /**  */
  token: string

  /**  */
  password?: string
}

export interface MapLayer {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  jurisdictionId: string
}

export interface BulkApplicationResendDTO {
  /**  */
  listingId: string
}

export interface AmiChartImportDTO {
  /**  */
  values: string

  /**  */
  name: string

  /**  */
  jurisdictionId: string
}

export interface AmiChartUpdateImportDTO {
  /**  */
  values: string

  /**  */
  amiId: string
}

export interface CommunityTypeDTO {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  description?: string
}

export interface PaginationDTO {
  /**  */
  page?: number

  /**  */
  pageSize?: number
}

export interface FeatureFlagAssociate {
  /**  */
  id: string

  /**  */
  associate: string[]

  /**  */
  remove: string[]
}

export interface FeatureFlagCreate {
  /**  */
  name: FeatureFlagEnum

  /**  */
  description: string

  /**  */
  active: boolean
}

export interface FeatureFlagUpdate {
  /**  */
  id: string

  /**  */
  description: string

  /**  */
  active: boolean
}

export interface ApplicationCsvQueryParams {
  /**  */
  id: string

  /**  */
  includeDemographics?: boolean

  /**  */
  timeZone?: string
}

export interface ListingLotteryStatus {
  /**  */
  id: string

  /**  */
  lotteryStatus: LotteryStatusEnum
}

export interface LotteryActivityLogItem {
  /**  */
  status: string

  /**  */
  name: string

  /**  */
  logDate: Date
}

export interface PublicLotteryResult {
  /**  */
  ordinal: number

  /**  */
  multiselectQuestionId?: string
}

export interface PublicLotteryTotal {
  /**  */
  total: number

  /**  */
  multiselectQuestionId?: string
}

export interface PropertyCreate {
  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  url?: string

  /**  */
  urlTitle?: string

  /**  */
  jurisdictions?: IdDTO
}

export interface PropertyUpdate {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  url?: string

  /**  */
  urlTitle?: string

  /**  */
  jurisdictions?: IdDTO
}

export interface PropertyFilterParams {
  /**  */
  $comparison: EnumPropertyFilterParamsComparison

  /**  */
  jurisdiction?: string
}

export interface PropertyQueryParams {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"

  /**  */
  search?: string

  /**  */
  filter?: string[]
}

export interface PaginatedProperty {
  /**  */
  items: Property[]

  /**  */
  meta: PaginationMeta
}

export interface AgencyCreate {
  /**  */
  name: string

  /**  */
  jurisdictions: IdDTO
}

export interface AgencyUpdate {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  jurisdictions: IdDTO
}

export interface AgencyQueryParams {
  /**  */
  page?: number

  /**  */
  limit?: number | "all"

  /**  */
  filter?: string[]
}

export interface AgencyFilterParams {
  /**  */
  $comparison: EnumAgencyFilterParamsComparison

  /**  */
  jurisdiction?: string
}

export interface PaginatedAgency {
  /**  */
  items: Agency[]

  /**  */
  meta: PaginationMeta
}

export enum FilterAvailabilityEnum {
  "closedWaitlist" = "closedWaitlist",
  "comingSoon" = "comingSoon",
  "openWaitlist" = "openWaitlist",
  "waitlistOpen" = "waitlistOpen",
  "unitsAvailable" = "unitsAvailable",
}

export enum HomeTypeEnum {
  "apartment" = "apartment",
  "duplex" = "duplex",
  "house" = "house",
  "townhome" = "townhome",
}

export enum RegionEnum {
  "Greater_Downtown" = "Greater_Downtown",
  "Eastside" = "Eastside",
  "Southwest" = "Southwest",
  "Westside" = "Westside",
}

export enum ListingsStatusEnum {
  "active" = "active",
  "pending" = "pending",
  "closed" = "closed",
  "pendingReview" = "pendingReview",
  "changesRequested" = "changesRequested",
}

export enum ListingTypeEnum {
  "regulated" = "regulated",
  "nonRegulated" = "nonRegulated",
}

export enum ParkingTypeEnum {
  "onStreet" = "onStreet",
  "offStreet" = "offStreet",
  "garage" = "garage",
  "carport" = "carport",
}
export enum EnumListingFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "<=" = "<=",
  "LIKE" = "LIKE",
  "NA" = "NA",
}
export enum ListingViews {
  "address" = "address",
  "base" = "base",
  "csv" = "csv",
  "full" = "full",
  "fundamentals" = "fundamentals",
  "name" = "name",
}

export enum ListingOrderByKeys {
  "mostRecentlyUpdated" = "mostRecentlyUpdated",
  "applicationDates" = "applicationDates",
  "mostRecentlyClosed" = "mostRecentlyClosed",
  "mostRecentlyPublished" = "mostRecentlyPublished",
  "name" = "name",
  "waitlistOpen" = "waitlistOpen",
  "status" = "status",
  "unitsAvailable" = "unitsAvailable",
  "marketingType" = "marketingType",
  "marketingYear" = "marketingYear",
  "marketingSeason" = "marketingSeason",
  "listingType" = "listingType",
}

export enum OrderByEnum {
  "asc" = "asc",
  "desc" = "desc",
}

export enum ListingFilterKeys {
  "availabilities" = "availabilities",
  "availability" = "availability",
  "bathrooms" = "bathrooms",
  "bedrooms" = "bedrooms",
  "bedroomTypes" = "bedroomTypes",
  "city" = "city",
  "counties" = "counties",
  "homeTypes" = "homeTypes",
  "ids" = "ids",
  "isVerified" = "isVerified",
  "jurisdiction" = "jurisdiction",
  "leasingAgent" = "leasingAgent",
  "listingFeatures" = "listingFeatures",
  "monthlyRent" = "monthlyRent",
  "multiselectQuestions" = "multiselectQuestions",
  "name" = "name",
  "neighborhood" = "neighborhood",
  "parkingType" = "parkingType",
  "regions" = "regions",
  "configurableRegions" = "configurableRegions",
  "reservedCommunityTypes" = "reservedCommunityTypes",
  "section8Acceptance" = "section8Acceptance",
  "status" = "status",
  "zipCode" = "zipCode",
  "listingType" = "listingType",
}

export enum ApplicationAddressTypeEnum {
  "leasingAgent" = "leasingAgent",
}

export enum ReviewOrderTypeEnum {
  "lottery" = "lottery",
  "firstComeFirstServe" = "firstComeFirstServe",
  "waitlist" = "waitlist",
  "waitlistLottery" = "waitlistLottery",
}

export enum LotteryStatusEnum {
  "errored" = "errored",
  "ran" = "ran",
  "approved" = "approved",
  "releasedToPartners" = "releasedToPartners",
  "publishedToPublic" = "publishedToPublic",
  "expired" = "expired",
}

export enum MultiselectQuestionsApplicationSectionEnum {
  "programs" = "programs",
  "preferences" = "preferences",
}

export enum ValidationMethodEnum {
  "radius" = "radius",
  "map" = "map",
  "none" = "none",
}

export enum MultiselectQuestionsStatusEnum {
  "draft" = "draft",
  "visible" = "visible",
  "active" = "active",
  "toRetire" = "toRetire",
  "retired" = "retired",
}

export enum ApplicationMethodsTypeEnum {
  "Internal" = "Internal",
  "FileDownload" = "FileDownload",
  "ExternalLink" = "ExternalLink",
  "PaperPickup" = "PaperPickup",
  "POBox" = "POBox",
  "LeasingAgent" = "LeasingAgent",
  "Referral" = "Referral",
}

export enum LanguagesEnum {
  "en" = "en",
  "es" = "es",
  "vi" = "vi",
  "zh" = "zh",
  "tl" = "tl",
  "bn" = "bn",
  "ar" = "ar",
  "ko" = "ko",
  "hy" = "hy",
  "fa" = "fa",
}

export enum ListingEventsTypeEnum {
  "openHouse" = "openHouse",
  "publicLottery" = "publicLottery",
  "lotteryResults" = "lotteryResults",
}

export enum UnitTypeEnum {
  "studio" = "studio",
  "oneBdrm" = "oneBdrm",
  "twoBdrm" = "twoBdrm",
  "threeBdrm" = "threeBdrm",
  "fourBdrm" = "fourBdrm",
  "SRO" = "SRO",
  "fiveBdrm" = "fiveBdrm",
}

export enum UnitRentTypeEnum {
  "fixed" = "fixed",
  "percentageOfIncome" = "percentageOfIncome",
}

export enum UnitAccessibilityPriorityTypeEnum {
  "mobility" = "mobility",
  "hearing" = "hearing",
  "vision" = "vision",
  "hearingAndVision" = "hearingAndVision",
  "mobilityAndHearing" = "mobilityAndHearing",
  "mobilityAndVision" = "mobilityAndVision",
  "mobilityHearingAndVision" = "mobilityHearingAndVision",
}

export enum RentTypeEnum {
  "fixedRent" = "fixedRent",
  "rentRange" = "rentRange",
}
export enum EnumUnitGroupAmiLevelMonthlyRentDeterminationType {
  "flatRent" = "flatRent",
  "percentageOfIncome" = "percentageOfIncome",
}
export enum MarketingTypeEnum {
  "marketing" = "marketing",
  "comingSoon" = "comingSoon",
}

export enum MarketingSeasonEnum {
  "spring" = "spring",
  "summer" = "summer",
  "fall" = "fall",
  "winter" = "winter",
}

export enum MonthEnum {
  "january" = "january",
  "february" = "february",
  "march" = "march",
  "april" = "april",
  "may" = "may",
  "june" = "june",
  "july" = "july",
  "august" = "august",
  "september" = "september",
  "october" = "october",
  "november" = "november",
  "december" = "december",
}
export enum EnumListingDepositType {
  "fixedDeposit" = "fixedDeposit",
  "depositRange" = "depositRange",
}
export enum EnumListingListingType {
  "regulated" = "regulated",
  "nonRegulated" = "nonRegulated",
}
export enum EnumUnitGroupAmiLevelCreateMonthlyRentDeterminationType {
  "flatRent" = "flatRent",
  "percentageOfIncome" = "percentageOfIncome",
}
export enum EnumListingCreateDepositType {
  "fixedDeposit" = "fixedDeposit",
  "depositRange" = "depositRange",
}
export enum EnumListingCreateListingType {
  "regulated" = "regulated",
  "nonRegulated" = "nonRegulated",
}
export enum EnumUnitGroupAmiLevelUpdateMonthlyRentDeterminationType {
  "flatRent" = "flatRent",
  "percentageOfIncome" = "percentageOfIncome",
}
export enum EnumListingUpdateDepositType {
  "fixedDeposit" = "fixedDeposit",
  "depositRange" = "depositRange",
}
export enum EnumListingUpdateListingType {
  "regulated" = "regulated",
  "nonRegulated" = "nonRegulated",
}
export enum AfsView {
  "pending" = "pending",
  "pendingNameAndDoB" = "pendingNameAndDoB",
  "pendingEmail" = "pendingEmail",
  "resolved" = "resolved",
}

export enum RuleEnum {
  "nameAndDOB" = "nameAndDOB",
  "email" = "email",
  "combination" = "combination",
}

export enum FlaggedSetStatusEnum {
  "flagged" = "flagged",
  "pending" = "pending",
  "resolved" = "resolved",
}

export enum IncomePeriodEnum {
  "perMonth" = "perMonth",
  "perYear" = "perYear",
}

export enum ApplicationStatusEnum {
  "submitted" = "submitted",
  "declined" = "declined",
  "receivedUnit" = "receivedUnit",
  "waitlist" = "waitlist",
  "waitlistDeclined" = "waitlistDeclined",
}

export enum ApplicationSubmissionTypeEnum {
  "paper" = "paper",
  "electronical" = "electronical",
}

export enum ApplicationReviewStatusEnum {
  "pending" = "pending",
  "pendingAndValid" = "pendingAndValid",
  "valid" = "valid",
  "duplicate" = "duplicate",
}

export enum YesNoEnum {
  "yes" = "yes",
  "no" = "no",
}

export enum AlternateContactRelationship {
  "familyMember" = "familyMember",
  "friend" = "friend",
  "caseManager" = "caseManager",
  "other" = "other",
  "noContact" = "noContact",
}

export enum HouseholdMemberRelationship {
  "spouse" = "spouse",
  "registeredDomesticPartner" = "registeredDomesticPartner",
  "parent" = "parent",
  "child" = "child",
  "sibling" = "sibling",
  "cousin" = "cousin",
  "aunt" = "aunt",
  "uncle" = "uncle",
  "nephew" = "nephew",
  "niece" = "niece",
  "grandparent" = "grandparent",
  "greatGrandparent" = "greatGrandparent",
  "inLaw" = "inLaw",
  "friend" = "friend",
  "other" = "other",
  "aideOrAttendant" = "aideOrAttendant",
}
export type AllExtraDataTypes = BooleanInput | TextInput | AddressInput
export enum MultiselectQuestionOrderByKeys {
  "jurisdiction" = "jurisdiction",
  "name" = "name",
  "status" = "status",
  "updatedAt" = "updatedAt",
}

export enum MultiselectQuestionViews {
  "base" = "base",
  "fundamentals" = "fundamentals",
}
export enum EnumMultiselectQuestionFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "<=" = "<=",
  "LIKE" = "LIKE",
  "NA" = "NA",
}
export enum UserRoleEnum {
  "user" = "user",
  "partner" = "partner",
  "admin" = "admin",
  "jurisdictionAdmin" = "jurisdictionAdmin",
  "limitedJurisdictionAdmin" = "limitedJurisdictionAdmin",
  "supportAdmin" = "supportAdmin",
}

export enum NeighborhoodAmenitiesEnum {
  "groceryStores" = "groceryStores",
  "publicTransportation" = "publicTransportation",
  "schools" = "schools",
  "parksAndCommunityCenters" = "parksAndCommunityCenters",
  "pharmacies" = "pharmacies",
  "healthCareResources" = "healthCareResources",
  "shoppingVenues" = "shoppingVenues",
  "hospitals" = "hospitals",
  "seniorCenters" = "seniorCenters",
  "recreationalFacilities" = "recreationalFacilities",
  "playgrounds" = "playgrounds",
  "busStops" = "busStops",
}

export enum SpokenLanguageEnum {
  "chineseCantonese" = "chineseCantonese",
  "chineseMandarin" = "chineseMandarin",
  "english" = "english",
  "filipino" = "filipino",
  "korean" = "korean",
  "russian" = "russian",
  "spanish" = "spanish",
  "vietnamese" = "vietnamese",
  "farsi" = "farsi",
  "afghani" = "afghani",
  "notListed" = "notListed",
}

export enum FeatureFlagEnum {
  "disableBuildingSelectionCriteria" = "disableBuildingSelectionCriteria",
  "disableCommonApplication" = "disableCommonApplication",
  "disableEthnicityQuestion" = "disableEthnicityQuestion",
  "disableJurisdictionalAdmin" = "disableJurisdictionalAdmin",
  "disableListingPreferences" = "disableListingPreferences",
  "disableWorkInRegion" = "disableWorkInRegion",
  "enableAccessibilityFeatures" = "enableAccessibilityFeatures",
  "enableAdaOtherOption" = "enableAdaOtherOption",
  "enableAdditionalResources" = "enableAdditionalResources",
  "enableApplicationStatus" = "enableApplicationStatus",
  "enableCompanyWebsite" = "enableCompanyWebsite",
  "enableConfigurableRegions" = "enableConfigurableRegions",
  "enableCreditScreeningFee" = "enableCreditScreeningFee",
  "enableFullTimeStudentQuestion" = "enableFullTimeStudentQuestion",
  "enableGeocodingPreferences" = "enableGeocodingPreferences",
  "enableGeocodingRadiusMethod" = "enableGeocodingRadiusMethod",
  "enableHomeType" = "enableHomeType",
  "enableHousingAdvocate" = "enableHousingAdvocate",
  "enableHousingDeveloperOwner" = "enableHousingDeveloperOwner",
  "enableIsVerified" = "enableIsVerified",
  "enableLimitedHowDidYouHear" = "enableLimitedHowDidYouHear",
  "enableListingFavoriting" = "enableListingFavoriting",
  "enableListingFileNumber" = "enableListingFileNumber",
  "enableListingFiltering" = "enableListingFiltering",
  "enableLeasingAgentAltText" = "enableLeasingAgentAltText",
  "enableListingImageAltText" = "enableListingImageAltText",
  "enableListingOpportunity" = "enableListingOpportunity",
  "enableListingPagination" = "enableListingPagination",
  "enableListingUpdatedAt" = "enableListingUpdatedAt",
  "enableMarketingFlyer" = "enableMarketingFlyer",
  "enableMarketingStatus" = "enableMarketingStatus",
  "enableMarketingStatusMonths" = "enableMarketingStatusMonths",
  "enableNeighborhoodAmenities" = "enableNeighborhoodAmenities",
  "enableNeighborhoodAmenitiesDropdown" = "enableNeighborhoodAmenitiesDropdown",
  "enableNonRegulatedListings" = "enableNonRegulatedListings",
  "enableParkingFee" = "enableParkingFee",
  "enablePartnerDemographics" = "enablePartnerDemographics",
  "enablePartnerSettings" = "enablePartnerSettings",
  "enablePetPolicyCheckbox" = "enablePetPolicyCheckbox",
  "enableProperties" = "enableProperties",
  "enableReferralQuestionUnits" = "enableReferralQuestionUnits",
  "enableRegions" = "enableRegions",
  "enableResources" = "enableResources",
  "enableSection8Question" = "enableSection8Question",
  "enableSingleUseCode" = "enableSingleUseCode",
  "enableSmokingPolicyRadio" = "enableSmokingPolicyRadio",
  "enableSpokenLanguage" = "enableSpokenLanguage",
  "enableSupportAdmin" = "enableSupportAdmin",
  "enableUnderConstructionHome" = "enableUnderConstructionHome",
  "enableUnitGroups" = "enableUnitGroups",
  "enableUtilitiesIncluded" = "enableUtilitiesIncluded",
  "enableVerifyIncome" = "enableVerifyIncome",
  "enableWaitlistAdditionalFields" = "enableWaitlistAdditionalFields",
  "enableWaitlistLottery" = "enableWaitlistLottery",
  "enableWhatToExpectAdditionalField" = "enableWhatToExpectAdditionalField",
  "enableParkingType" = "enableParkingType",
  "enableV2MSQ" = "enableV2MSQ",
  "example" = "example",
  "hideCloseListingButton" = "hideCloseListingButton",
  "swapCommunityTypeWithPrograms" = "swapCommunityTypeWithPrograms",
}

export enum InputType {
  "boolean" = "boolean",
  "text" = "text",
  "address" = "address",
  "hhMemberSelect" = "hhMemberSelect",
}

export enum ApplicationOrderByKeys {
  "firstName" = "firstName",
  "lastName" = "lastName",
  "submissionDate" = "submissionDate",
  "createdAt" = "createdAt",
}

export enum ApplicationsFilterEnum {
  "all" = "all",
  "lottery" = "lottery",
  "closed" = "closed",
  "open" = "open",
}

export enum ModificationEnum {
  "add" = "add",
  "remove" = "remove",
}

export enum MfaType {
  "sms" = "sms",
  "email" = "email",
}
export enum EnumPropertyFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "<=" = "<=",
  "LIKE" = "LIKE",
  "NA" = "NA",
}
export enum EnumAgencyFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "<=" = "<=",
  "LIKE" = "LIKE",
  "NA" = "NA",
}
